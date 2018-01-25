import React from 'react'
import Search from './search.react'
import Table from './table.react'

export default class BusinessTaxChangeTaxAnalysisNegative extends React.Component {
    state={
        filter:undefined,
        updateKey:Date.now()
    }
    filterChange=(values)=>{
        this.setState({filter:values,updateKey:Date.now()})
    }
    render() {
        return (
            <div>
                <Search filterChange={this.filterChange}/>
                <Table filter={this.state.filter} updateKey={this.state.updateKey}/>
            </div>
        );
    }
}