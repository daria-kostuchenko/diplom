import React, { useState, useEffect } from 'react';
import '../../sass/DimensionSelection.sass';
import ModalPortal from '../modal/ModalPortal';
import DimensionSelectionField from './DimensionSelectionField';
import ModalWrapper from '../modal/ModalWrapper';
import * as timeData from '../../js_modules/timeData';
import { getDimensionValuesQuery, getTablesQuery } from '../../js_modules/queryHelper';
import { getChosenTimeObject } from '../../js_modules/timeObjectBuilder';
import { getPreferredDimensions } from '../../js_modules/preferredDimensions';
import PropTypes from 'prop-types';


const DimensionSelection = (props) => {

  const [showModal, setShowModal] = useState(false);
  const [modalAbbr, setModalAbbr] = useState(null);

  const [dimensionValues, setDimensionValues] = useState({});
  const [dimensionChosenValues, setDimensionChosenValues] = useState({});
  const [tables, setTables] = useState([]);
  const [preferredDimensions, setPreferredDimensions] = useState({})

  const [chosenTimeValue, setChosenTimeValue] = useState(timeData.initialTime);



  useEffect(() => {
    //get dimensions values and tables from server on mounting
    const setupDimensionValues = () => {

      let values = {};
      let chosenValues = {};
      let tablesList = [];

      let requests = props.dimensions.map(dimension => {
        return (

          fetch(getDimensionValuesQuery(dimension.Abbr))
            .then(response => response.json())
            .then(json => {
              values = { ...values, [dimension.Abbr]: json };

              let value = json[0] ? json[0] : null;
              chosenValues = { ...chosenValues, [dimension.Abbr]: [value] };
            })

        )
      });

      requests.push(
        fetch(getTablesQuery())
          .then(response => response.json())
          .then(json => tablesList = json)
      )

      Promise.all(requests)
        .then(() => {
          setTables(tablesList);
          setDimensionValues(values);
          setDimensionChosenValues(chosenValues);

          let dimensions = getPreferredDimensions(
            chosenValues['A'], tablesList, props.dimensions);
          setPreferredDimensions(dimensions);
        });
    }

    setupDimensionValues();

    //actually on mounting
  }, [props.dimensions])


  const onOpenModal = (abbr) => {
    if (dimensionChosenValues[abbr]) {
      setModalAbbr(abbr);
      setShowModal(true);
    }
  }


  const onModalAcceptClick = (values) => {
    if (modalAbbr === 'A') {
      let dimensions = getPreferredDimensions(values, tables, props.dimensions);
      setPreferredDimensions(dimensions);
    }

    //set chosenTimeValue
    if (modalAbbr === 'T') {
      setChosenTimeValue(values);
    } else {
      setDimensionChosenValues({ ...dimensionChosenValues, [modalAbbr]: values });
    }
    closeModal();
  }


  const onModalCancelClick = () => {
    closeModal();
  }


  const closeModal = () => {
    setModalAbbr(null);
    setShowModal(false);
  }


  const getPreferredValues = () => {
    let values = {};

    for (const key in preferredDimensions) {
      if (preferredDimensions.hasOwnProperty(key)) {

        const dimensionAbbr = preferredDimensions[key];
        values[dimensionAbbr] = dimensionChosenValues[dimensionAbbr];

      }
    }
    return values;
  }


  const getValuesOfHeader = (header) => {
    let values = {};
    header.forEach(dimension => {
      if (dimensionChosenValues[dimension.Abbr]) {
        values[dimension.Abbr] = dimensionChosenValues[dimension.Abbr];
      }
    });
    return values;
  }


  const onApplyClick = (leftHeader, topHeader) => {
    if (leftHeader.length !== 0 &&
      topHeader.length !== 0 &&
      Object.keys(dimensionChosenValues).length !== 0) {

      //get time in a desired data structure
      let timeObject = getChosenTimeObject(chosenTimeValue);

      let values = {
        // ...dimensionChosenValues,
        ...getValuesOfHeader(leftHeader),
        ...getValuesOfHeader(topHeader),
        ...getPreferredValues(),
        'T': timeObject
      }

      props.onApplyClick(leftHeader, topHeader, values);
    }

  }


  return (
    <>
      {/* {console.log('render dimension selection')} */}
      <DimensionSelectionField
        dimensions={props.dimensions}
        onOpenModal={onOpenModal}
        dimensionValues={dimensionChosenValues}
        onApplyClick={onApplyClick}
        preferredDimensions={preferredDimensions}
      />

      {showModal && <ModalPortal>
        <ModalWrapper
          onCancelClick={onModalCancelClick}
          onAcceptClick={onModalAcceptClick}
          modalAbbr={modalAbbr}
          tree={dimensionValues[modalAbbr]}
          dimensionValues={dimensionChosenValues[modalAbbr]}
          chosenTimeValue={chosenTimeValue}
        />
      </ModalPortal>}

    </>
  )
}

DimensionSelection.propTypes = {
  dimensions: PropTypes.arrayOf(PropTypes.object),
  onApplyClick: PropTypes.func
}

export default DimensionSelection;

