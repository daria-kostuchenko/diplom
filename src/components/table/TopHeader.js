import React, { Component } from 'react';
import HeadCell from './HeadCell';
import PropTypes from 'prop-types';

export default class TopHeader extends Component {

  render() {

    return (
      <div className="head__horizontal">

        {console.log('this.props.tNodes', this.props.tNodes)}
        
        {this.props.tNodes[0] &&
          this.props.headerValues[this.props.tNodes[0].Abbr].map(value => {
            return (
              <HeadCell
                key={value.ID}
                node={value}
                isSubnode={false}
                isOpened={true}
                isVertical={false}
                index={1}
                tNodes={this.props.tNodes}
                headerValues={this.props.headerValues}
                pushNode={this.props.addNodeToHorizontalNodes}
              />)
          })}
        {/* {this.props.tNodes.map(n => {
          console.log('n', n);
          console.log('n abbr values', this.props.headerValues[n.Abbr]);//массив объектов

          return (this.props.headerValues[n.Abbr].map(value => {
            console.log('value', value)
            return (
              <HeadCell
                key={value.ID}
                node={value}
                isSubnode={false}
                isOpened={true}
                isVertical={false}
                pushNode={this.props.addNodeToHorizontalNodes}
              />)
          }))
        }
        )} */}
        {/* {this.props.TNodes.map(n => {
          console.log('n', n)
          return (


            <HeadCell
              key={n.id}
              node={n}
              isSubnode={false}
              isOpened={true}
              isVertical={false}
              pushNode={this.props.addNodeToHorizontalNodes}
            />)
        }
        )} */}
        {/* </div> */}

      </div>
    )
  }
}

TopHeader.propTypes = {
  tNodes: PropTypes.arrayOf(PropTypes.object),
  headerValues: PropTypes.object,
  addNodeToHorizontalNodes: PropTypes.func
};
