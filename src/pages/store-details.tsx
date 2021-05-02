import {useContext, useState, useEffect} from 'react'
import {f7, Page, Navbar, List, ListInput, Fab, Icon, Actions, ActionsButton} from 'framework7-react'
import {StateContext} from '../data/state-provider'
import labels from '../data/labels'
import {addAlarm, getMessage, showMessage, showError} from '../data/actions'

type Props = {
  id: string
}
const StoreDetails = (props: Props) => {
  const {state} = useContext(StateContext)
  const [store, setStore] = useState(() => state.stores.find(s => s.id === props.id)!)
  const [actionOpened, setActionOpened] = useState(false);
  const [error, setError] = useState('')
  useEffect(() => {
    setStore(() => state.stores.find(s => s.id === props.id)!)
  }, [state.stores, props.id])
  useEffect(() => {
    if (error) {
      showError(error)
      setError('')
    }
  }, [error])
  const handleAddAlarm = (type: string) => {
    f7.dialog.confirm(labels.confirmationText, labels.confirmationTitle, () => {
      try{
        if (state.alarms.find(a => a.storeId === props.id && a.time === new Date())){
          throw new Error('duplicateAlarms')
        }
        const alarm = {
          packId: props.id,
          storeId: store.id!,
          type,
          time: new Date()  
        }
        addAlarm(alarm)
        showMessage(labels.sendSuccess)
        f7.views.current.router.back()
      } catch(err) {
        setError(getMessage(f7.views.current.router.currentRoute.path, err))
      }
    })  
  }

  return (
    <Page>
      <Navbar title={labels.storeDetails} backLink={labels.back} />
      <List form inlineLabels>
        <ListInput 
          name="name" 
          label={labels.name}
          value={store.name}
          type="text" 
          readonly
        />
        <ListInput
          name="mobile"
          label={labels.mobile}
          value={store.mobile}
          type="number"
          readonly
        />
        <ListInput
          name="location"
          label={labels.location}
          value={state.locations.find(l => l.id === store.locationId)?.name || ''}
          type="text"
          readonly
        />
        <ListInput 
          name="address" 
          label={labels.address}
          value={store.address}
          type="text"
        />
      </List>
      <Fab position="left-top" slot="fixed" color="red" className="top-fab" onClick={() => setActionOpened(true)}>
        <Icon material="menu"></Icon>
      </Fab>
      <Actions opened={actionOpened} onActionsClosed={() => setActionOpened(false)}>
        <ActionsButton onClick={() => handleAddAlarm('m')}>
          {labels.addNotFoundAlarm}
        </ActionsButton>
        <ActionsButton onClick={() => handleAddAlarm('p')}>
          {labels.addChangePriceAlarm}
        </ActionsButton>
      </Actions>
    </Page>
  )
}
export default StoreDetails
