/* Add attribute to group block, in Sidebar */
/* https://wholesomecode.ltd/add-controls-to-the-core-and-third-party-block-sidebar-with-filters-and-higher-order-components */

import { __ } from "@wordpress/i18n";

import { addFilter } from "@wordpress/hooks";
import { Fragment } from "@wordpress/element";
import { createHigherOrderComponent } from "@wordpress/compose";
import { InspectorControls } from "@wordpress/blockEditor";
import { PanelBody, ToggleControl } from "@wordpress/components";

import classnames from "classnames";

import "./style.scss";
import "./editor.scss";

// Enable attributes on group block
const enableSidebarOnBlocks = ["core/columns"];

/**
 * Declare attribute
 */
const setSidebarSelectAttribute = (settings, name) => {
	// Do nothing if it's another block than our defined ones.
	if (!enableSidebarOnBlocks.includes(name)) {
		return settings;
	}

	settings.attributes = Object.assign(settings.attributes, {
		reverseOnMobile: { type: "boolean", default: false },
		reverseOnDesktop: { type: "boolean", default: false },
	});
	return settings;
};

addFilter(
	"blocks.registerBlockType",
	"reverse-blocks/set-sidebar-attribute",
	setSidebarSelectAttribute
);

/**
 * Add select
 */
const withSidebarSelect = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		// If current block is not allowed
		if (!enableSidebarOnBlocks.includes(props.name)) {
			return <BlockEdit {...props} />;
		}
		const { attributes, setAttributes } = props;
		const { reverseOnMobile, reverseOnDesktop } = attributes;

		return (
			<Fragment>
				<BlockEdit {...props} />
				<InspectorControls>
					<PanelBody
						title={__("Reverse", "wafelmedia-utility-blocks")}
						initialOpen={true}
					>
						<ToggleControl
							label={__("Reverse on Mobile", "wafelmedia-utility-blocks")}
							checked={reverseOnMobile}
							onChange={() =>
								setAttributes({ reverseOnMobile: !reverseOnMobile })
							}
						/>
						<ToggleControl
							label={__("Reverse on Desktop", "wafelmedia-utility-blocks")}
							checked={reverseOnDesktop}
							onChange={() =>
								setAttributes({ reverseOnDesktop: !reverseOnDesktop })
							}
						/>
					</PanelBody>
				</InspectorControls>
			</Fragment>
		);
	};
}, "withInspectorControls");

addFilter(
	"editor.BlockEdit",
	"reverse-blocks/with-sidebar-select",
	withSidebarSelect
);

/**
 * Save attribute
 * https://mariecomet.fr/en/2021/12/14/adding-options-controls-existing-gutenberg-block/
 */
const saveSidebarSelectAttribute = (extraProps, blockType, attributes) => {
	// Do nothing if it's another block than our defined ones.
	if (enableSidebarOnBlocks.includes(blockType.name)) {
		const { reverseOnMobile, reverseOnDesktop } = attributes;

		if (reverseOnMobile || reverseOnDesktop) {
			extraProps.className = classnames(extraProps.className, {
				"reverse-on-mobile": reverseOnMobile,
				"reverse-on-desktop": reverseOnDesktop,
			});
		}
	}
	return extraProps;
};

addFilter(
	"blocks.getSaveContent.extraProps",
	"reverse-blocks/save-sidebar-select-attribute",
	saveSidebarSelectAttribute
);
