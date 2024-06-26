import {useEffect, useState} from "react";

import {
  Box,
  Button,
  Modal,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from "@mui/material";

import style from "../../assets/css/ChangeDeviceModal.module.css"
import styl from "../../assets/css/ChildModalDeleteMaterial.module.css"
import {Device, Logs} from '../../models';
import {AddSnackbar} from "../../redux/actions/snackbarAction";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../redux/store";
import DeviceService from "../../services/DeviceService";
import LogsService from "../../services/LogsService";

function ChangeDeviceModal(props: { receivedMaterial: Device, closeEvent: () => void }) {
  const user = useSelector((state: RootState) => state.currentUser.user);
  const dispatch = useDispatch<AppDispatch>();
  const [device, setDevice] = useState<Device>(props.receivedMaterial);
  const [openChildModal, setOpenChildModal] = useState(false);
  const [disabled, setDisabled] = useState<boolean>(true);

  const handleClose = () => {
    setOpenChildModal(false);
  };

  const saveChange = async () => {
    const savedDevice = await DeviceService.saveDevice(device)
    if (!savedDevice) {
      const newLog: Logs = {
        id: undefined,
        user_login: user!.login,
        action: "Изменение прибора",
        status: "ОШИБКА",
        result: "Не удалось изменить прибор. Количество в эксплуатации: " + device.inOperation + ". Количество на складе: " + device.inStock + ".",
        element_number: device.id,
        date: new Date()
      }
      try {
        await LogsService.addLog(newLog);
      } catch (e) {
        console.log(e)
      }

      dispatch(AddSnackbar({
        messageText: "Не удалось изменить прибор!",
        messageType: "error",
        key: +new Date()
      }))
      return
    }
    const newLog: Logs = {
      id: undefined,
      user_login: user!.login,
      action: "Изменение прибора",
      status: "ОК",
      result: "Изменение прибора прошло успешно. Количество в эксплуатации: " + device.inOperation + ". Количество на складе: " + device.inStock + ".",
      element_number: device.id,
      date: new Date()
    }
    try {
      await LogsService.addLog(newLog);
    } catch (e) {
      console.log(e)
    }

    dispatch(AddSnackbar({
      messageText: "Прибор успешно изменен!",
      messageType: "success",
      key: +new Date()
    }))
    setOpenChildModal(false);
    props.closeEvent()
    const allDevices = await DeviceService.getAllDevices()
    if (!allDevices) return
    dispatch(allDevices)
  }
  const deleteDevice = async () => {
    const isDelete = await DeviceService.deleteDeviceByCsss(device.csss)
    if (!isDelete) {
      const newLog: Logs = {
        id: undefined,
        user_login: user!.login,
        action: "Удаление прибора",
        status: "ОШИБКА",
        result: "Не удалось удалить прибор",
        element_number: device.id,
        date: new Date()
      }
      try {
        await LogsService.addLog(newLog);
      } catch (e) {
        console.log(e)
      }

      dispatch(AddSnackbar({
        messageText: "Не удалось удалить прибор!",
        messageType: "error",
        key: +new Date()
      }))
      return
    }
    const newLog: Logs = {
      id: undefined,
      user_login: user!.login,
      action: "Удаление прибора",
      status: "ОК",
      result: "Прибор успешно удален",
      element_number: device.id,
      date: new Date()
    }
    try {
      await LogsService.addLog(newLog);
    } catch (e) {
      console.log(e)
    }

    dispatch(AddSnackbar({
      messageText: "Прибор успешно удален!",
      messageType: "success",
      key: +new Date()
    }))

    setOpenChildModal(false);
    props.closeEvent()

    const allDevices = await DeviceService.getAllDevices()
    if (!allDevices)
      return
    dispatch(allDevices)
  }

  function changeMaterialInOperation(newValue: number) {
    if (newValue < 0) return;

    if (newValue < device!.inOperation && device!.inOperation - 1 >= 0) {
      setDevice({...device!, inOperation: device!.inOperation - 1})
      return;
    }
    if (newValue > device!.inOperation && device!.inStock - 1 >= 0) {
      setDevice({...device!, inOperation: device!.inOperation + 1, inStock: device!.inStock - 1})
    } else {
      dispatch(AddSnackbar({
        messageText: "Приборы на складе закончились!",
        messageType: "error",
        key: +new Date()
      }))
    }
  }

  function changeMaterialInStock(newValue: number) {
    if (newValue >= 0) {
      if (newValue > device!.inStock) {
        setDevice({...device!, inStock: device!.inStock + 1})
      }
      if (newValue < device!.inStock) {
        setDevice({...device!, inStock: device!.inStock - 1})
      }
    }
  }

  function changeMinimalAmount(newValue: number) {
    if (newValue >= 0) {
      if (newValue > device!.minimalAmount) {
        setDevice({...device!, minimalAmount: device!.minimalAmount + 1})
      }
      if (newValue < device!.minimalAmount) {
        setDevice({...device!, minimalAmount: device!.minimalAmount - 1})
      }
    }
  }

  function changeReplacementFrequencyt(newValue: number) {
    if (newValue >= 0) {
      if (newValue > device!.replacementFrequency) {
        setDevice({...device!, replacementFrequency: device!.replacementFrequency + 1})
      }
      if (newValue < device!.replacementFrequency) {
        setDevice({...device!, replacementFrequency: device!.replacementFrequency - 1})
      }
    }
  }

  useEffect(() => {
    if (user) {
      setDisabled(false)
    }
  }, [user])

  return (
    <Box className={style.modalStyle}>
      <Stack direction="column"
             justifyContent="space-between"
             spacing={2}
             sx={{width: '97.6%', height: '100%'}} style={{margin: '0px'}}>
        <div style={{width: '100%', height: '80%'}}>
          <Paper sx={{width: '100%'}}
                 style={{marginLeft: "0px", padding: "20px", marginBottom: "8px"}}>
            <Stack direction="row" spacing={2} sx={{width: '100%'}} mb={1}>
              <Typography mb={2}>Редактирование прибора:</Typography>
              <Typography color="primary">{device ? device!.title : ""}</Typography>
              <Typography mb={2}>№КССС:</Typography>
              <Typography color="primary">{device ? device!.csss : ""}</Typography>
              <Typography mb={2}>№R-3:</Typography>
              <Typography color="primary">{device ? device!.nr3 : ""}</Typography>
            </Stack>
            <Stack direction="row" spacing={2} justifyContent="space-between">
              <div>
                <Stack direction="row" spacing={2} mt={1}>
                  <Typography style={{marginTop: "1%"}}>Количество в эксплуатации:</Typography>

                  <TextField variant="outlined" size='small' type="number"
                             style={{width: "25%"}}
                             disabled={disabled}
                             value={device ? device!.inOperation : ""}
                             onChange={(newValue) => changeMaterialInOperation(parseInt(newValue.target.value))}
                             InputLabelProps={{
                               shrink: true,
                             }}
                  />
                </Stack>
                <Stack direction="row" spacing={2} mt={1}>
                  <Typography style={{marginTop: "1%"}}>Количество на складе:</Typography>
                  <TextField variant="outlined" size='small' type="number"
                             style={{marginLeft: "65px", width: "25%"}}
                             disabled={disabled}
                             value={device ? device!.inStock : 0}
                             onChange={(newValue) => changeMaterialInStock(parseInt(newValue.target.value))}
                             InputLabelProps={{
                               shrink: true,
                             }}
                             InputProps={{
                               inputProps: {min: 0}
                             }}
                  />
                </Stack>
              </div>
              <div>
                <Stack direction="row" spacing={2} mt={1} justifyContent="flex-end">
                  <Typography style={{marginTop: "1%"}}>Минимальный остаток:</Typography>
                  <TextField variant="outlined" size='small' type="number"
                             style={{width: "25%", marginLeft: "24px", marginRight: "60px"}}
                             disabled={disabled}
                             value={device ? device!.minimalAmount : 0}
                             onChange={(newValue) => changeMinimalAmount(parseInt(newValue.target.value))}
                             InputLabelProps={{
                               shrink: true,
                             }}
                             InputProps={{
                               inputProps: {min: 0}
                             }}
                  />
                </Stack>
                <Stack direction="row" spacing={2} mt={1} justifyContent="flex-end">
                  <Typography style={{marginTop: "1%"}}>Периодичность замены:</Typography>
                  <TextField variant="outlined" size='small' type="number"
                             style={{width: "25%"}}
                             disabled={disabled}
                             value={device ? device!.replacementFrequency : 0}
                             onChange={(newValue) => changeReplacementFrequencyt(parseInt(newValue.target.value))}
                             InputLabelProps={{
                               shrink: true,
                             }}
                             InputProps={{
                               inputProps: {min: 0}
                             }}
                  />
                  <Typography style={{marginTop: "2%"}}>Дней</Typography>
                </Stack>
              </div>
            </Stack>
          </Paper>
          <div className='section' style={{height: '70%', width: '102.6%'}}>
            <TableContainer component={Paper}>
              <Typography sx={{padding: '10px'}}>Расходные материалы прибора:</Typography>
              <Table sx={{width: "100%"}} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Наименование</TableCell>
                    <TableCell align="right">№R-3</TableCell>
                    <TableCell align="right">№КССС</TableCell>
                    <TableCell align="right">Количество в эксплуатации</TableCell>
                    <TableCell align="right">Количество на складе</TableCell>
                  </TableRow>
                </TableHead>
                {device?.consumables !== undefined && (
                  <>
                    {device?.consumables.length !== 0 && (
                      <TableBody>
                        {device?.consumables.map((row) => (
                          <TableRow
                            key={row.consumable!.nr3}
                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                          >
                            <TableCell component="th" scope="row">
                              {row.consumable!.title}
                            </TableCell>
                            <TableCell align="right">{row.consumable!.nr3}</TableCell>
                            <TableCell align="right">{row.consumable!.csss}</TableCell>
                            <TableCell align="right">{row.consumable!.inOperation}</TableCell>
                            <TableCell align="right">{row.consumable!.inStock}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    )}
                  </>
                )}
              </Table>
            </TableContainer>

          </div>
        </div>
        <Paper sx={{width: '100%'}} style={{padding: "20px"}}>
          <Stack direction='row' justifyContent='space-between' sx={{width: '100%'}}>
            {user && user.role === "ADMIN" ? (
              <Button variant="outlined" disabled={disabled} onClick={() => setOpenChildModal(true)}>Удалить
                прибор</Button>
            ) : (
              <div></div>
            )}
            <Button variant="contained" disabled={disabled} onClick={saveChange}>Сохранить изменения</Button>
          </Stack>
        </Paper>
        <Modal
          open={openChildModal}
          onClose={handleClose}
          aria-labelledby="child-modal-title"
          aria-describedby="child-modal-description"
        >
          <Box className={styl.childModalStyle}>
            <Typography>Вы точно хотите удалить прибор? </Typography>
            <Typography color="primary">{device ? device!.title : ""}</Typography>
            <Stack direction='row' spacing={1} alignItems="center" justifyContent="center">
              <Typography>№КССС:</Typography>
              <Typography color="primary">{device ? device!.csss : ""}</Typography>
              <Typography mb={2}>№R-3:</Typography>
              <Typography color="primary">{device ? device!.nr3 : ""}</Typography>
            </Stack>
            <Stack direction='row' justifyContent="space-between" m={8}>
              <Button onClick={handleClose} variant="contained">Отмена</Button>
              <Button onClick={deleteDevice} variant="contained">Удалить</Button>
            </Stack>
          </Box>
        </Modal>
      </Stack>
    </Box>
  )
}

export default ChangeDeviceModal;
