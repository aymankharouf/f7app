import React, { useContext } from 'react'
import { Button, Block } from 'framework7-react'
import { StoreContext } from '../data/Store';

const Sections = props => {
  const { state } = useContext(StoreContext)
  let i = 0
  return (
    <Block>
      {state.sections.map(section => {
        return (
          <Button large fill className="sections" color={state.randomColors[i++ % 13].name} href={`/section/${section.id}`} key={section.id}>
            {section.name}
          </Button>
        )
      })}
    </Block>
  )

}
export default Sections