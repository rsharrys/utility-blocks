/* Add attribute in Sidebar
 * https://developer.wordpress.org/block-editor/reference-guides/components/box-control/
 */

import { __ } from "@wordpress/i18n";

import { addFilter } from "@wordpress/hooks";
import { Fragment } from "@wordpress/element";
import { createHigherOrderComponent } from "@wordpress/compose";
import { InspectorControls } from "@wordpress/blockEditor";
import {
	PanelBody,
	SelectControl,
	__experimentalBoxControl as BoxControl,
} from "@wordpress/components";

//import classnames from "classnames";

import "./style.scss";
import "./editor.scss";

/**
 * Declare attribute
 */
const setSidebarSelectAttribute = (settings) => {
	if (typeof settings.attributes !== "undefined") {
		settings.attributes = Object.assign(settings.attributes, {
			positionType: { type: "string" },
			positionSize: { type: "string" },
		});
	}
	return settings;
};

addFilter(
	"blocks.registerBlockType",
	"position-blocks/set-sidebar-attribute",
	setSidebarSelectAttribute
);

/**
 * Add select
 */
const withSidebarSelect = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		const { attributes, setAttributes } = props;
		const { positionType, positionSize } = attributes;

		return (
			<Fragment>
				<BlockEdit {...props} />
				<InspectorControls>
					<PanelBody
						title={__("Position", "utility-blocks")}
						initialOpen={true}
					>
						<SelectControl
							value={positionType}
							resetValues={true}
							options={[
								{
									label: __("None"),
									value: "",
								},
								{
									label: __("Absolute"),
									value: "absolute",
								},
								{
									label: __("Relative"),
									value: "relative",
								},
								{
									label: __("Fixed"),
									value: "fixed",
								},
								{
									label: __("Sticky"),
									value: "sticky",
								},
							]}
							onChange={(value) => {
								setAttributes({
									positionType: value,
								});
							}}
						/>
						<BoxControl
							label={__("Margin")}
							values={positionSize}
							onChange={(positionSize) => setAttributes({ positionSize })}
							allowReset={true}
							inputProps={{ min: -300 }}
						/>
					</PanelBody>
				</InspectorControls>
			</Fragment>
		);
	};
}, "withInspectorControls");

addFilter(
	"editor.BlockEdit",
	"position-blocks/with-sidebar-select",
	withSidebarSelect
);

/**
 * Add container class to block in Edit
 * https://wp-qa.com/adding-inline-style-to-gutenberg-core-blocks-in-the-editor
 */
const withSidebarSelectProp = createHigherOrderComponent((BlockListBlock) => {
	return (props) => {
		const { attributes } = props;
		const { positionType, positionSize } = attributes;

		const posTop = positionSize?.top;
		const posRight = positionSize?.right;
		const posBottom = positionSize?.bottom;
		const posLeft = positionSize?.left;

		const wrapperProps = props.wrapperProps ? props.wrapperProps : {};

		if (typeof positionType !== "undefined" && positionType) {
			wrapperProps.style = {
				position: positionType,
				top: posTop,
				right: posRight,
				bottom: posBottom,
				left: posLeft,
			};

			return <BlockListBlock {...props} wrapperProps={wrapperProps} />;
		}
		return <BlockListBlock {...props} />;
	};
}, "withSidebarSelectProp");

addFilter(
	"editor.BlockListBlock",
	"position-blocks/with-sidebar-select-prop",
	withSidebarSelectProp
);

/**
 * Save attribute
 * https://mariecomet.fr/en/2021/12/14/adding-options-controls-existing-gutenberg-block/
 * https://wordpress.org/support/topic/cannot-add-top-left-etc-styles-with-blocks-getsavecontent-extraprops-filter/
 */
const saveSidebarSelectAttribute = (extraProps, blockType, attributes) => {
	const { positionType, positionSize } = attributes;

	const posTop = positionSize?.top;
	const posRight = positionSize?.right;
	const posBottom = positionSize?.bottom;
	const posLeft = positionSize?.left;

	if (typeof positionType !== "undefined" && positionType) {
		Object.assign(extraProps, {
			style: {
				...extraProps.style,
				position: positionType,
				top: posTop,
				right: posRight,
				bottom: posBottom,
				left: posLeft,
			},
		});
	}

	return extraProps;
};

addFilter(
	"blocks.getSaveContent.extraProps",
	"position-blocks/save-sidebar-select-attribute",
	saveSidebarSelectAttribute
);
