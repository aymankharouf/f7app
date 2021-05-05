import {useContext, useState, useEffect} from 'react'
import {Block, Page, Navbar, Button} from 'framework7-react'
import {StateContext} from '../data/state-provider'
import labels from '../data/labels'
import {randomColors} from '../data/config'

const StoreSummary = () => {
  const {state} = useContext(StateContext)
  const [storePacksCount, setStorePacksCount] = useState(0)
  useEffect(() => {
    setStorePacksCount(() => state.packStores.filter(p => p.storeId === state.userInfo?.storeId).length)
  }, [state.packStores, state.userInfo])
  let i = 0
  return(
    <Page>
      <Navbar title={labels.myPacks} backLink={labels.back} />
      <Block>
        <Button 
          text={`${labels.myPacks} (${storePacksCount})`}
          large 
          fill 
          className="sections" 
          color={randomColors[i++ % 10].name} 
          href={storePacksCount === 0 ? '' : '/store-packs/p'} 
        />
        <Button 
          text={`${labels.packRequests} (${state.packRequests.filter(r => r.storeId === state.userInfo?.storeId).length})`}
          large 
          fill 
          className="sections" 
          color={randomColors[i++ % 10].name} 
          href={state.packRequests.length === 0 ? '' : '/store-packs/r'} 
        />
        <Button 
          text={labels.productRequests}
          large 
          fill 
          className="sections" 
          color={randomColors[i++ % 10].name} 
          href="/product-requests/"
        />
      </Block>
    </Page>
  )
}

export default StoreSummary
