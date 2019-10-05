import React, { useContext } from 'react'
import {Page, Navbar, NavLeft, NavTitle, Link, Toolbar, NavTitleLarge } from 'framework7-react'
import Sections from './Sections'
import BottomToolbar from './BottomToolbar';
import { StoreContext } from '../data/Store';


const HomePage = props => {
  const { state } = useContext(StoreContext)

  return (
    <Page>
      <Navbar large largeTransparent sliding={false}>
        <NavLeft>
          <Link iconIos="f7:bars" iconMd="material:menu" panelOpen="right"></Link>
        </NavLeft>
        <NavTitle sliding>
          <img src="/logo.png" alt="" className="logo" />
          <span className='banner'>{state.labels.banner}</span>
        </NavTitle>
        <NavTitleLarge>
          <img src="/logo.png" alt="" className="logo" />
          <span className='banner'>{state.labels.banner}</span>
        </NavTitleLarge>
      </Navbar>
      <Sections/>
      <Toolbar bottom>
        <BottomToolbar isHome="1"/>
      </Toolbar>
    </Page>
  )
}

export default HomePage
