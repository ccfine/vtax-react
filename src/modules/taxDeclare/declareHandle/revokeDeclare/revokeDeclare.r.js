import React from 'react'
import ApplyDeclare from '../../applyDeclare'

export default function RevokeDeclare(props){
    return <ApplyDeclare key={Date.parse(new Date())/1000} url='/tax/decConduct/list/revoke' decAction='edit'/>
}