import React, { useEffect, useState } from 'react';
import DataTable from './table/DataTable';
import DimensionSelection from './dimensions/DimensionSelection';
import * as queryHelper from '../js_modules/queryHelper';
import { createHeaderTree } from '../js_modules/tableHeaderHelper';
import { getHashTable } from '../js_modules/hashTableHelper';

function MainComponent() {

  const [dimensions, setDimensions] = useState([]);
  const [topHeaderTree, setTopHeaderTree] = useState([]);
  const [leftHeaderTree, setLeftHeaderTree] = useState([]);

  const [obtainedValuesForValuesArea, setObtainedValuesForValuesArea] = useState();
  const [queryParams, setQueryParams] = useState({});


  useEffect(() => {
    //get dimension list from server on mounting
    fetch(queryHelper.getDimensionsQuery())
      .then(response => response.json())
      .then(json => setDimensions(json))
  }, [])


  const onApplyClick = (leftH, topH, values) => {
    let queryParams = {
      topHdr: [],
      leftHdr: [],
      values: {}
    }

    queryParams.leftHdr = queryHelper.createQueryHdr(leftH);
    queryParams.topHdr = queryHelper.createQueryHdr(topH);

    queryParams.values = queryHelper.getAllDimensionsValuesIds(values);

    // queryParams.values = queryHelper.createQueryValues(values);
    let topTree = createHeaderTree(topH, values);
    let leftTree = createHeaderTree(leftH, values);

    queryParams.values = getChildrenValues(topTree, queryParams.values);
    queryParams.values = getChildrenValues(leftTree, queryParams.values);


    let query = queryHelper.getDataTableQuery(queryParams);
    console.log('query', query);

    fetch(query)
      .then(response => response.json())
      .then(json => {
        let hashTable = getHashTable(json);
        setObtainedValuesForValuesArea(hashTable);

        setTopHeaderTree(topTree);
        setLeftHeaderTree(leftTree);

        setQueryParams(queryParams);
      })

  }


  const getChildrenValues = (tree, paramValues) => {
    // let result = [];
    tree.forEach(node => {
      if (node.isOpened && node.Children) {
        paramValues[node.Abbr].push(
          ...queryHelper.getListValues(node.Children, node.Abbr, paramValues)
        );
      }
    });

    return paramValues;
  }


  return (
    <div className='app-container'>
      {dimensions.length !== 0 &&
        <DimensionSelection
          dimensions={dimensions}
          onApplyClick={onApplyClick}
        />
      }

      {topHeaderTree.length !== 0 && leftHeaderTree.length !== 0 &&
        <DataTable
          topHeaderTree={topHeaderTree}
          leftHeaderTree={leftHeaderTree}
          hashTable={obtainedValuesForValuesArea}
          queryParams={queryParams}
        />}
    </div>
  )
}

export default MainComponent;
