import React from 'react'
import ApplyDeclare from '../../applyDeclare'

export default function LookDeclare(props){
    return <ApplyDeclare key={Date.parse(new Date())/1000} url='/tax/decConduct/query/find' decAction=''/>
}