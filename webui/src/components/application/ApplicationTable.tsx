import {useEffect, useState} from "react";
import fileDownload from "js-file-download";
import {Application, Logs} from "../../models";
import ApplicationService from "../../services/ApplicationService";
import {
  Button,
  Modal,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import moment from 'moment';
import {AddSnackbar} from "../../redux/actions/snackbarAction";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../redux/store";
import ChangeApplicationModal from "./ChangeApplicationModal";
import LogsService from "../../services/LogsService";

export default function ApplicationTable(props: { applications: Application[] }) {
  const user = useSelector((state: RootState) => state.currentUser.user);
  const {applications} = props;
  const [orders, setOrders] = useState<Application[]>([]);
  const [key, setKey] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();

  const [application, setApplication] = useState<Application>()
  const [openChangeApplicationModal, setChangeApplicationModal] = useState(false);

  const handleOpenEditApplicationModal = async (application: Application) => {
    console.log(application)
    if (!application) return;
    setApplication(application);
  }
  const handleCloseEditApplicationModal = () => {
    setApplication(undefined);
  }

  const downloadApplication = async (id: number) => {
    const res = await ApplicationService.downloadFile(id);
    if (!res)
      return
    fileDownload(res, `application-${id}.xlsx`)
  }

  const archiveApplication = async (id: number) => {
    const inArchive = await ApplicationService.archiveApplicationById(id)
    if (!inArchive) {
      dispatch(AddSnackbar({
        messageText: "Не удалось архивировать заявку!",
        messageType: "error",
        key: +new Date()
      }))

      const newLog: Logs = {
        id: undefined,
        user_login: user!.login,
        action: "Архивирование заявки",
        status: "ОШИБКА",
        result: "Не удалось архивировать заявку",
        element_number: id,
        date: new Date()
      }
      try {
        await LogsService.addLog(newLog);
      } catch (e) {
        console.log(e)
      }

      return
    }
    dispatch(AddSnackbar({
      messageText: "Заявка успешно архивирована!",
      messageType: "success",
      key: +new Date()
    }))

    const newLog: Logs = {
      id: undefined,
      user_login: user!.login,
      action: "Архивирование заявки",
      status: "ОК",
      result: "Архивирование прошло успешно",
      element_number: id,
      date: new Date()
    }
    try {
      await LogsService.addLog(newLog);
    } catch (e) {
      console.log(e)
    }

    const allApplication = await ApplicationService.getAllApplications(null, false,)
    if (!allApplication)
      return
    setOrders(allApplication)
    //dispatch(allApplication)
  }

  useEffect(() => {
    if (application)
      setChangeApplicationModal(true)
    else
      setChangeApplicationModal(false)
  }, [application])
  useEffect(() => {
    if (key) return;
    setKey(true);
    setOrders(applications)
  }, [])

  return (
    <div className='section' style={{height: '100%', width: '100%'}}>
      {orders.length !== 0 ? (
        <TableContainer component={Paper}>
          <Table sx={{minWidth: 650}} aria-label="simple table">
            <TableHead>
              <TableRow sx={{cursor: "default"}}>
                <TableCell>Номер</TableCell>
                <TableCell align="left">Тип закупа</TableCell>
                <TableCell align="center">Дата</TableCell>
                <TableCell align="center">Статус</TableCell>
                {user ? (
                  <TableCell align="center">Архивация</TableCell>
                ) : (
                  <></>
                )}
                <TableCell align="center">Скачивание</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((row) => (
                <TableRow
                  key={row.number}
                  sx={{'&:last-child td, &:last-child th': {border: 0, cursor: "pointer"}}}
                >
                  <TableCell onClick={() => {
                    handleOpenEditApplicationModal(row)
                  }}>{row.number}</TableCell>
                  <TableCell align="left" onClick={() => {
                    handleOpenEditApplicationModal(row)
                  }}>{row.title}</TableCell>
                  <TableCell align="center" onClick={() => {
                    handleOpenEditApplicationModal(row)
                  }}>{moment(row.date).format('DD.MM.YYYY')}</TableCell>
                  <TableCell align="center" onClick={() => {
                    handleOpenEditApplicationModal(row)
                  }}>{row.status}</TableCell>
                  {user ? (
                    <TableCell align="center"><Button
                      variant="outlined" onClick={() => {
                      archiveApplication(row.number!)
                    }}>Архивировать</Button>
                    </TableCell>
                  ) : (
                    <></>
                  )}
                  <TableCell align="center">
                    <Button variant="outlined" onClick={() => {
                      downloadApplication(row.number!)
                    }}>Скачать</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

      ) : (
        <Stack spacing={2}>
          {[0, 1, 2, 3, 4].map((i) => (
            <Skeleton variant="rounded" height={100} sx={{width: '100%'}} key={i}/>
          ))}
        </Stack>
      )}
      {
        application &&
        <Modal
          open={openChangeApplicationModal}
          onClose={handleCloseEditApplicationModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <ChangeApplicationModal receivedApplication={application} closeEvent={() => {
            handleCloseEditApplicationModal()
            setApplication(undefined)
          }}/>

        </Modal>
      }
    </div>
  )
}
