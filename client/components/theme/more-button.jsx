/** @format */

/**
 * External dependencies
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { isFunction, map } from 'lodash';
import Gridicon from 'gridicons';

/**
 * Internal dependencies
 */
import PopoverMenu from 'components/popover/menu';
import PopoverMenuItem from 'components/popover/menu-item';
import { isOutsideCalypso } from 'lib/url';

/**
 * Component
 */
class ThemeMoreButton extends Component {
	constructor( props ) {
		super( props );
		this.state = { showPopover: false };
		this.togglePopover = this.togglePopover.bind( this );
		this.closePopover = this.closePopover.bind( this );
		this.onClick = this.onClick.bind( this );
		this.onPopoverActionClick = this.onPopoverActionClick.bind( this );
	}

	togglePopover() {
		this.setState( prevState => ( { showPopover: ! prevState.showPopover } ) );
		! this.state.showPopover &&
			this.props.onMoreButtonClick( this.props.themeId, this.props.index, 'popup_open' );
	}

	closePopover( action ) {
		this.setState( { showPopover: false } );
		if ( isFunction( action ) ) {
			action();
		}
	}

	popoverAction( action, label ) {
		action( this.props.themeId );
		this.props.onMoreButtonClick( this.props.themeId, this.props.index, 'popup_' + label );
	}

	onPopoverActionClick( action, label ) {
		return () => this.popoverAction( action, label );
	}

	focus( event ) {
		event.target.focus();
	}

	onClick( action, label ) {
		return this.closePopover.bind( this, this.onPopoverActionClick( action, label ) );
	}

	render() {
		const classes = classNames(
			'theme__more-button',
			{ 'is-active': this.props.active },
			{ 'is-open': this.state.showPopover }
		);

		return (
			<span className={ classes }>
				<button ref="more" onClick={ this.togglePopover }>
					<Gridicon icon="ellipsis" size={ 24 } />
				</button>

				<PopoverMenu
					context={ this.refs && this.refs.more }
					isVisible={ this.state.showPopover }
					onClose={ this.closePopover }
					position="top left"
				>
					{ map(
						this.props.options,
						function( option, key ) {
							if ( option.separator ) {
								return <hr key={ key } className="popover__hr" />;
							}
							if ( option.getUrl ) {
								const url = option.getUrl( this.props.themeId );
								return (
									<a
										className="theme__more-button-menu-item popover__menu-item"
										onMouseOver={ this.focus }
										onClick={ this.onClick( option.action, option.label ) }
										key={ option.label }
										href={ url }
										target={ isOutsideCalypso( url ) ? '_blank' : null }
									>
										{ option.label }
									</a>
								);
							}
							if ( option.action ) {
								return (
									<PopoverMenuItem
										key={ option.label }
										action={ this.onPopoverActionClick( option.action, option.label ) }
									>
										{ option.label }
									</PopoverMenuItem>
								);
							}
							// If neither getUrl() nor action() are specified, filter this option.
							return null;
						}.bind( this )
					) }
				</PopoverMenu>
			</span>
		);
	}
}

ThemeMoreButton.propTypes = {
	themeId: PropTypes.string,
	// Index of theme in results list
	index: PropTypes.number,
	// More elaborate onClick action, used for tracking.
	// Made to not interfere with DOM onClick
	onMoreButtonClick: PropTypes.func,
	// Options to populate the popover menu with
	options: PropTypes.objectOf(
		PropTypes.shape( {
			label: PropTypes.string,
			header: PropTypes.string,
			action: PropTypes.func,
			getUrl: PropTypes.func,
		} )
	).isRequired,
	active: PropTypes.bool,
};

export default ThemeMoreButton;
