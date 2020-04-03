import React, { Component } from 'react';
import Highlight from 'highlight.js';
import {
  DataTableSkeleton,
  Breadcrumb,
  BreadcrumbItem,
  Tabs,
  Tab,
  Button,
  SkeletonText,
  CodeSnippet,
  Pagination,
  Tooltip
} from 'carbon-components-react';
import AttributeTable from './AttributeTable';
import AttributeList from './AttributeList';
import GroupList from './GroupList';
import Footer from '../InfoFooter/Footer';
var format = require('xml-formatter');

//props
const props = {
  tabs: {
    selected: 0,
    triggerHref: '#',
    role: 'navigation',
  },
  tab: {
    href: '#',
    role: 'presentation',
    tabIndex: 0,
  },
};
const headers = [
  {
    key: 'name',
    header: 'Name',
  },
  {
    key: 'value',
    header: 'Value',
  }
];
const groupHeaders = [
  {
    key: 'name',
    header: 'Group name',
  }
];
const TabContentRenderedOnlyWhenSelected = ({
  selected,
  children,
  className,
  ...other
}) =>
  !selected ? (
    <div {...other} className={`bx--visually-hidden`} />
  ) : (
    <div
      {...other}
      className={`bx--tab-content`}
      selected={selected}>
      {children}
    </div>
  );

//data.attributes.$var = name
//data.attributes.$var[0] = value;
const getRowItems = rows =>
  rows.map(row => ({
    ...row,
    id: row.id,
    key: row.id,
    name: row.name,
    value: row.value
  }));
const specificDataParse = data => {
  let id_counter = 1
  let parsedJSON = []
  for(var x in data.attributes){
    parsedJSON.push({'id':id_counter, 'name':x, 'value': data.attributes[x][0]})
    id_counter++
  }
  //console.log("Parsed Attrs", parsedJSON);
  return parsedJSON
}
const specificGroupParse = data => {
  let id_counter = 1
  let parsedJSON = []
  for(var x in data.group){
    parsedJSON.push({'id':id_counter, 'name': data.group[x]})
    id_counter++
  }
  //console.log("Parsed Group", parsedJSON);
  return parsedJSON
}

class ViewProfile extends Component {

  // Initialize the state
  state = {
    user: [],
    loading: true,
    userAttrRows: [],
    groupRows: [],
    userTotalItems: 0,
    userFirstRowIndex: 0,
    userCurrentPageSize: 10,
    groupTotalItems: 0,
    groupFirstRowIndex: 0,
    groupCurrentPageSize: 10
  }
  componentDidMount() {
    
    //Use Session data
    fetch(`/api/v1.0/session/attributes`)
    //Use static data
    // fetch(`/api/v1.0/static/attributes`)
    .then(res => res.json())
    .then((data) => {
      this.setState({
        user: data,
        loading: false,
        userAttrRows: specificDataParse(data),
        userTotalItems: specificDataParse(data).length,
        groupRows: specificGroupParse(data),
        groupTotalItems: specificGroupParse(data).length,
      })
    })
    .catch(console.log)
  }


  render() {
    const code = (this.state.loading) ? null : this.state.user.assertion.result;
    return (
      <div className="bx--grid landing-page">
        <div className="bx--row landing-page__breadcrumb">
          <div className="bx--col-lg-12">
            <Breadcrumb aria-label="Page navigation">
              <BreadcrumbItem>
                <a href="/">Back to home</a>
              </BreadcrumbItem>
            </Breadcrumb>
          </div>
        </div>
        <div className="bx--row landing-page__banner">
          <div className="bx--col-lg-8 bx--col-md-6">
              { this.state.loading ? (
                <div
                  style={{
                    width: '300px'
                  }}
                >
                  <h1 className="landing-page__heading">
                    <SkeletonText
                      heading
                      width="100%"
                    />
                  </h1>
                </div>
              ) : (
                <div>
                  <h1 className="landing-page__heading">
                    Hello {this.state.user.name_id}
                    <Tooltip
                      direction="right"
                      tabIndex={0}
                      showIcon
                    >
                      <p>
                        This attribute is derived from the "NameID" from your SAML assertion.
                      </p>
                    </Tooltip>
                  </h1>
                </div>
              )
            }
          </div>
          <div className="bx--col-lg-4 bx--col-md-2">
            <Button kind="secondary" className="button-logout" onClick={() => window.location.replace('/logout')}>Logout</Button>
          </div>
        </div>
        <div className="bx--row profile-content">
          <div className="bx--col">
            <Tabs {...props.tabs}>
              <Tab {...props.tab} label="Attributes">
                <div className="profile-content-tab">
                  <div>
                  { this.state.loading ? (
                        <DataTableSkeleton
                          columnCount={headers.length + 1}
                          rowCount={1}
                          headers={headers}
                        />
                    ) : (
                      <AttributeTable
                        headers={headers}
                        rows={[{
                          id: '1',
                          name: 'Subject',
                          value: this.state.user.name_id
                        }]}
                        />
                    )
                  }
                  </div>
                  <div>
                  { this.state.loading ? (
                        <DataTableSkeleton
                          columnCount={headers.length + 1}
                          rowCount={5}
                          headers={headers}
                        />
                    ) : (
                      <div>
                        <AttributeList
                        headers={headers}
                        rows={this.state.userAttrRows.slice(
                              this.state.userFirstRowIndex,
                              this.state.userFirstRowIndex + this.state.userCurrentPageSize
                            )}
                        /><Pagination
                          totalItems={this.state.userTotalItems}
                          backwardText="Previous page"
                          forwardText="Next page"
                          pageSize={this.state.userCurrentPageSize}
                          pageSizes={[5, 10, 15, 25]}
                          itemsPerPageText="Items per page"
                          onChange={({ page, pageSize }) => {
                            if (pageSize !== this.state.userCurrentPageSize) {
                              this.setState({userCurrentPageSize: pageSize})
                            }
                            this.setState({userFirstRowIndex: pageSize * (page - 1)})
                          }}
                        />
                      </div>
                    )
                  }
                  </div>
                </div>
              </Tab>
              <Tab {...props.tab} label="Groups">
                <div className="profile-content-tab">
                  <div>
                  { this.state.loading ? (
                        <DataTableSkeleton
                          columnCount={headers.length + 1}
                          rowCount={5}
                          headers={groupHeaders}
                        />
                    ) : (
                      <div><GroupList
                        headers={groupHeaders}
                        rows={this.state.groupRows}
                        />
                        <Pagination
                          totalItems={this.state.groupTotalItems}
                          backwardText="Previous page"
                          forwardText="Next page"
                          pageSize={this.state.groupCurrentPageSize}
                          pageSizes={[5, 10, 15, 25]}
                          itemsPerPageText="Items per page"
                          onChange={({ page, pageSize }) => {
                            if (pageSize !== this.state.groupCurrentPageSize) {
                              this.setState({groupCurrentPageSize: pageSize})
                            }
                            this.setState({groupFirstRowIndex: pageSize * (page - 1)})
                          }}
                        />
                      </div>
                    )
                  }
                  </div>
                </div>
              </Tab>
              <Tab {...props.tab} light={true} renderContent={TabContentRenderedOnlyWhenSelected} label="SAML assertion">
                <div className="profile-content-tab">
                  <div className="bx--data-table-header">
                    <h4 className="bx--data-table-header__title">SAML assertion</h4>
                    <p class="bx--data-table-header__description">View the raw assertion that was received from your Identity Provider.</p>
                  </div>
                  { this.state.loading ? (
                      <div
                        style={{
                          width: '300px'
                        }}
                      >
                        <SkeletonText
                          lineCount={5}
                          paragraph
                          width="100%"
                        />
                      </div>
                    ) : (
                      <div
                        className="snippetBackground"
                      >
                      <CodeSnippet type="multi">
                        {format(this.state.user.assertion.result)}
                      </CodeSnippet>
                      </div>
                    )
                  }
                </div>
              </Tab>
            </Tabs>
          </div>
        </div>
        <Footer text="Need help?" link="/" linktext="Visit the knowledge center" className="landing-page__r3" />
      </div>
    );
  }
}
export default ViewProfile;
