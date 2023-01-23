// import React, { useEffect, useState } from 'react'
import React, { useEffect, useState } from 'react'
import CardComponent from './card/card'
import './app.css'

// import backgrounds
import types from '../types.json'
// import cainBG from '../assets/cain.png'
// import brainBG from '././assets/brain.png'

// const types = {}

export default function App(){
    
    // useEffect(async () => {
    //     for (let [type, o] of Object.entries(typesD)) {
    //         const d = {}
    //         d.backgrounds = []
    //         o.backgrounds.forEach(async bgPath => {
    //             const bg = await React.lazy(() => import(bgPath))
    //             d.backgrounds.push(bg)
    //         })
    //         types[type] = d
    //     }

    // }, [])
    const [cType, setCType] = useState(Object.keys(types)[0])
    // const [background, setBackground] = useState(Object.keys(types)[0].backgrounds[0])
    const [backgroundI, setBackgroundI] = useState('')

    // const [count, setCount] = useState(0)
    const [cardName, setCardName] = useState('Card name')
    const [cardText, setCardText] = useState('Card text')

    function bgClick(index) {
        // e.preventDefault()
        setBackgroundI(index)
    }

    function onTextChange(e) {
        setCardText(e.target.value)
    }

    function onNameChange(e) {
        setCardName(e.target.value)
    }

    function onTypeChange(e) {
        console.log(e.target.value);
        setCType(e.target.value)
    }

    // useEffect(() => {
    //     setCount(Number(localStorage.getItem('count')) ?? 0)
    // }, [])

    const selectedBgClass = 'selected-bg'
    return (
        <>
        <form action='https://google.com/search' method='GET'>
            <div className='book-layout'>
                <div>
                    <label>Type: </label>
                    <select onChange={onTypeChange}>
                        {
                            Object.keys(types).map(t => {
                                return <option key={t}>{t}</option>
                            })
                        }
                    </select>
                    
                    <br/>
                    
                    <label>Background</label>
                    <div>
                        {types[cType].backgrounds.map((bg, i) => {
                            return <img key={i} src={bg} alt='Failed to load background' className={`mini-bg ${ backgroundI == i ? selectedBgClass : ''}`} onClick={e => bgClick(i)}></img>
                        })}
                    </div>

                    <br/>

                    <label>Name: </label>
                    <input name='q' type='text' maxLength='20' onChange={onNameChange}></input>
                    

                    <br/>
                    
                    <label>Text: </label>
                    <br/>
                    <textarea className='card-text-edit' onChange={onTextChange}></textarea>
                    <br/>
                    

                    <input type='submit' value='Save' className='button'></input>
                    <input type='submit' value='Cancel' className='button'></input>


                    {/* <h1>{count}</h1>
                    <input type='button' className='button' onClick={() => {setCount(count+1); localStorage.setItem('count', count+1)}} value='Increment!'/>
                    <input type='button' className='button' onClick={() => {setCount(0); localStorage.setItem('count', 0)}} value='Reset'/> */}
                </div>
                
                <CardComponent cardName={cardName} cardText={cardText} background={types[cType].backgrounds[backgroundI]}/>

            </div>
        </form>
        </>
    )
}