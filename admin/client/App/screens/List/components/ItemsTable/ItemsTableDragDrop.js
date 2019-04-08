import PropTypes from 'prop-types';
import React from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { Sortable } from './ItemsTableRow';
import DropZone from './ItemsTableDragDropZone';

class ItemsTableDragDrop extends React.Component {
	render () {
		return (
			<tbody >
				{this.props.items.results.map((item, i) => {
					return (
						<Sortable key={item.id}
							index={i}
							sortOrder={item.sortOrder || 0}
							id={item.id}
							item={item}
							{...this.props}
						/>
					);
				})}
				<DropZone {...this.props} />
			</tbody>
		);
	}
}

ItemsTableDragDrop.displayName = 'ItemsTableDragDrop';

ItemsTableDragDrop.propTypes = {
	columns: PropTypes.array,
	id: PropTypes.any,
	index: PropTypes.number,
	items: PropTypes.object,
	list: PropTypes.object,
};

module.exports = DragDropContext(HTML5Backend)(ItemsTableDragDrop);
