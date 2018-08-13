import React from 'react'
import ApplyDeclare from '../../applyDeclare'

export default function HandleDeclare(props){
    return <ApplyDeclare key={Date.parse(new Date())/1000} url='tax/decConduct/list/handle' decAction='edit'/>
}