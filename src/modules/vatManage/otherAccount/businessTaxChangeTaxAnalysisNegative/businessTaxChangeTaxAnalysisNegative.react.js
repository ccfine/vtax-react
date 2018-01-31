import React from 'react'
import Search from './search.react'
import Table from './table.react'
import { getUrlParam } from '../../../../utils'
import { withRouter } from 'react-router'
import moment from 'moment'
class BusinessTaxChangeTaxAnalysisNegative extends React.Component {
    state={
        filter:undefined,
        updateKey:Date.now()
    }
    filterChange=(values)=>{
        this.setState({filter:values,updateKey:Date.now()})
    }
    componentDidMount(){
        const {search} = this.props.location;
        if(!!search){
            this.filterChange({
                mainId:getUrlParam('mainId') || undefined,
                authMonth:moment(getUrlParam('authMonthStart')).format('YYYY-MM') || undefined,
            })
        }
    }
    render() {
        const {search} = this.props.location;
        let disabled = !!search;
        return (
            <div>
                <Search search={search} disabled={disabled} filterChange={this.filterChange} />
                <Table filter={this.state.filter} updateKey={this.state.updateKey}/>
            </div>
        );
    }
}
export default withRouter(BusinessTaxChangeTaxAnalysisNegative)