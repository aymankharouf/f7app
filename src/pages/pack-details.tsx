import {useContext, useEffect, useState} from 'react'
import {f7, Page, Navbar, Card, CardContent, CardHeader, CardFooter, Fab, Icon, Actions, ActionsButton, Preloader, List, ListItem, Button, Toolbar} from 'framework7-react'
import RatingStars from './rating-stars'
import {StateContext} from '../data/state-provider'
import {addPackStore, changePrice, deleteStorePack, addStoreRequest, showMessage, showError, getMessage, productOfText, rateProduct} from '../data/actions'
import labels from '../data/labels'
import {PackStore, Store} from '../data/types'
import Footer from './footer'

type Props = {
  id: string,
  type: string
}
type ExtendedPackStore = PackStore & {
  storeInfo: Store,
  storeLocation?: string
}
const PackDetails = (props: Props) => {
  const {state, dispatch} = useContext(StateContext)
  const [error, setError] = useState('')
  const [pack] = useState(() => state.packs.find(p => p.id === props.id)!)
  const [isAvailable, setIsAvailable] = useState(false)
  const [otherProducts] = useState(() => state.packs.filter(pa => pa.product.id !== pack?.product.id && pa.product.categoryId === pack?.product.categoryId))
  const [otherPacks] = useState(() => state.packs.filter(pa => pa.id !== pack?.id && pa.product.id === pack?.product.id))
  const [actionOpened, setActionOpened] = useState(false);
  const [ratingOpened, setRatingOpened] = useState(false);
  const [packStores, setPackStores] = useState<ExtendedPackStore[]>([])
  const [trademarkName] = useState(() => state.trademarks.find(t => t.id === pack.product.trademarkId)?.name)
  const [countryName] = useState(() => state.countries.find(c => c.id === pack.product.countryId)!.name)
  const [myPrice] = useState(() => state.packStores.find(ps => ps.packId === pack.id && ps.storeId === state.userInfo?.storeId)?.price)
  const [storeLocation] = useState(() => state.stores.find(s => s.id === state.userInfo?.storeId)?.locationId)
  const [stores] = useState(() => state.packStores.filter(ps => ps.packId === pack.id && ps.isRetail && ps.storeId !== state.userInfo?.storeId).length)
  const [nearStores] = useState(() => state.packStores.filter(ps => ps.packId === pack.id && ps.isRetail && ps.storeId !== state.userInfo?.storeId && state.stores.find(s => s.id === ps.storeId)?.locationId === storeLocation).length)
  const [bestPriceStores] = useState(() => state.packStores.filter(ps => ps.packId === pack.id && ps.isRetail && ps.storeId !== state.userInfo?.storeId && ps.price === pack.price).length)
  const [bestPriceNearStores] = useState(() => state.packStores.filter(ps => ps.packId === pack.id && ps.isRetail && ps.storeId !== state.userInfo?.storeId && ps.price === pack.price && state.stores.find(s => s.id === ps.storeId)?.locationId === storeLocation).length)
  const [salesmen] = useState(() => state.packStores.filter(ps => ps.packId === pack.id && !ps.isRetail && ps.storeId !== state.userInfo?.storeId).length)

  useEffect(() => {
    if (state.userInfo?.type === 'n') {
      setPackStores(() => {
        const packStores = state.packStores.filter(p => p.packId === pack?.id)
        const results = packStores.map(p => {
          const storeInfo = state.stores.find(s => s.id === p.storeId)!
          const storeLocation = state.locations.find(l => l.id === storeInfo.locationId)?.name
          return {
            ...p,
            storeInfo,
            storeLocation
          }
        })
        return results.sort((r1, r2) => r1.price > r2.price ? 1 : -1)
      })
    }
  }, [state.packStores, state.stores, state.locations, state.user, pack, state.userInfo])
  useEffect(() => {
    setIsAvailable(() => Boolean(state.packStores.find(p => p.storeId === state.userInfo?.storeId && p.packId === pack?.id)))
  }, [state.packStores, state.userInfo, pack])
  useEffect(() => {
    if (error) {
      showError(error)
      setError('')
    }
  }, [error])
  const deletePrice = (flag: boolean) => {
    try{
      const storePack = state.packStores.find(p => p.storeId === state.userInfo?.storeId && p.packId === pack?.id)!
      deleteStorePack(storePack, state.packStores, state.packs, flag)
      if (flag) dispatch({type: 'ADD_TO_BASKET', payload: pack})
      showMessage(flag ? labels.addSuccess : labels.deleteSuccess)
      f7.views.current.router.back()
    } catch(err) {
      setError(getMessage(f7.views.current.router.currentRoute.path, err))
    }
  }
  const handleUnAvailable = () => {
    f7.dialog.confirm(labels.newRequestText, labels.newRequestTitle, () => deletePrice(true), () => deletePrice(false))
  }

  const handleNewRequest = () => {
    try{
      addStoreRequest(state.userInfo?.storeId!, pack?.id!)
      dispatch({type: 'ADD_TO_BASKET', payload: pack})
      showMessage(labels.addSuccess)
      f7.views.current.router.back()
    } catch(err) {
      setError(getMessage(f7.views.current.router.currentRoute.path, err))
    }
  }
  const handleAvailable = (type: string) => {
    f7.dialog.prompt(labels.price, labels.enterPrice, value => {
      try{
        if (+value !== Number((+value).toFixed(2))) {
          throw new Error('invalidPrice')
        }
        if (+value <= 0) {
          throw new Error('invalidPrice')
        }
        if (Math.abs(+value - pack?.price!) / pack?.price! > 0.25) {
          throw new Error('invalidChangePrice')
        }
        if (type === 'c' && +value === state.packStores.find(p => p.packId === pack?.id && p.storeId === state.userInfo?.storeId)?.price) {
          throw new Error('samePrice')
        }
        const storePack = {
          packId: pack?.id!,
          storeId: state.userInfo?.storeId!,
          isRetail: state.userInfo?.type === 's',
          price: +value,
          time: new Date()
        }
        if (type === 'n') addPackStore(storePack, state.packs, state.storeRequests)
        else changePrice(storePack, state.packStores)
        showMessage(type === 'n' ? labels.addSuccess : labels.editSuccess)
        f7.views.current.router.back()
      } catch(err) {
        setError(getMessage(f7.views.current.router.currentRoute.path, err))
      }
    })
  }
  const handleRate = (value: number) => {
    try{
      rateProduct(pack?.product!, value, state.packs)
      showMessage(labels.ratingSuccess)   
		} catch (err){
      setError(getMessage(f7.views.current.router.currentRoute.path, err))
    }
  }
  if (!pack) return <Page><Preloader /></Page>
  return (
    <Page>
      <Navbar title={pack.product.name} backLink={labels.back} />
      <Card>
        <CardHeader className="card-header">
          <div className="price">
            {pack.price!.toFixed(2)}
          </div>
        </CardHeader>
        <CardContent>
          <p className="card-title">{pack.name}</p>
          <img src={pack.imageUrl} className="img-card" alt={labels.noImage} />
          <p className="card-title">{pack.product.description}</p>
        </CardContent>
        <CardFooter>
          <p>{productOfText(countryName, trademarkName)}</p>
          <p><RatingStars rating={pack.product.rating ?? 0} count={pack.product.ratingCount ?? 0} /></p>
        </CardFooter>
      </Card>
      {state.user && 
        <Fab position="left-top" slot="fixed" color="red" className="top-fab" onClick={() => setActionOpened(true)}>
          <Icon material="menu" />
        </Fab>
      }
      {!state.user && 
        <Button 
          text={labels.showPackStores}
          large 
          fill 
          className="sections"
          color="green"
          href="/login/"
        />
      }
      {state.userInfo?.type === 'n' &&
        <List mediaList>
          {packStores.map((p, i) => 
            <ListItem 
              link={`/store-details/${p.storeId}/${p.packId}`}
              title={p.storeInfo.name}
              subtitle={p.storeLocation || p.storeInfo.address}
              after={p.price.toFixed(2)} 
              key={i} 
            />
          )}
        </List>
      }
      {state.userInfo?.type !== 'n' &&
        <List mediaList>
          <ListItem title={labels.myPrice} after={myPrice?.toFixed(2)} />
          <ListItem title={labels.storesCount} after={stores.toString()} />
          <ListItem title={labels.nearBy} after={nearStores.toString()} />
          <ListItem title={labels.bestStoresCount} after={bestPriceStores.toString()} />
          <ListItem title={labels.bestStoresNearByCount} after={bestPriceNearStores.toString()} />
          <ListItem title={labels.salesmenCount} after={salesmen.toString()} />
        </List>
      }
      <Actions opened={actionOpened} onActionsClosed={() => setActionOpened(false)}>
        {!state.userInfo?.storeId &&
          <>
            {!state.basket.find(p => p.id === props.id) && 
              <ActionsButton onClick={() => dispatch({type: 'ADD_TO_BASKET', payload: pack})}>
                {labels.addToBasket}
              </ActionsButton>
           }
            {!state.ratings.find(r => r.productId === pack.product.id) && 
              <ActionsButton onClick={() => setRatingOpened(true)}>
                {labels.rateProduct}
              </ActionsButton>
            }
            {otherProducts.length > 0 &&
              <ActionsButton onClick={() => f7.views.current.router.navigate(`/hints/${pack.id}/type/a`)}>
                {labels.otherProducts}
              </ActionsButton>
            }
            {otherPacks.length > 0 &&
              <ActionsButton onClick={() => f7.views.current.router.navigate(`/hints/${pack.id}/type/p`)}>
                {labels.otherPacks}
              </ActionsButton>
            }
          </>
        }
        {state.userInfo?.storeId && 
          <>
            {!state.storeRequests.find(r => r.packId === pack?.id && r.storeId === state.userInfo?.storeId) &&
              <ActionsButton onClick={handleNewRequest}>
                {labels.newRequest}
              </ActionsButton>
            }
            {isAvailable && <>
              <ActionsButton onClick={handleUnAvailable}>
                {labels.unAvailable}
              </ActionsButton>
              <ActionsButton onClick={() => handleAvailable('c')}>
                {labels.changePrice}
              </ActionsButton>
            </>}
            {!isAvailable &&
              <ActionsButton onClick={() => handleAvailable('n')}>
                {labels.available}
              </ActionsButton>
            }
            {!pack.subPackId && <>
              <ActionsButton onClick={() => f7.views.current.router.navigate(`/add-pack/${props.id}`)}>
                {labels.addPack}
              </ActionsButton>
              <ActionsButton onClick={() => f7.views.current.router.navigate(`/add-group/${props.id}`)}>
                {labels.addGroup}
              </ActionsButton>
            </>}
          </>
        }
      </Actions>
      <Actions opened={ratingOpened} onActionsClosed={() => setActionOpened(false)}>
        <ActionsButton onClick={() => handleRate(5)}>
          {labels.rateGood}
          <Icon material="thumb_up" color="green" style={{margin: '5px'}}></Icon>
        </ActionsButton>
        <ActionsButton onClick={() => handleRate(3)}>
          {labels.rateMiddle}
          <Icon material="thumbs_up_down" color="blue" style={{margin: '5px'}}></Icon>
        </ActionsButton>
        <ActionsButton onClick={() => handleRate(1)}>
          {labels.rateBad}
          <Icon material="thumb_down" color="red" style={{margin: '5px'}}></Icon>
        </ActionsButton>
      </Actions>
      <Toolbar bottom>
        <Footer />
      </Toolbar>
    </Page>
  )
}

export default PackDetails
