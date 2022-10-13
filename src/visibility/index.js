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

/**
 * Declare attribute
 */
const setSidebarSelectAttribute = (settings) => {
	if (typeof settings.attributes !== "undefined") {
		settings.attributes = Object.assign(settings.attributes, {
			hideOnMobile: { type: "boolean", default: false },
			hideOnTablet: { type: "boolean", default: false },
			hideOnDesktop: { type: "boolean", default: false },
		});
	}
	return settings;
};

addFilter(
	"blocks.registerBlockType",
	"visibility-blocks/set-sidebar-attribute",
	setSidebarSelectAttribute
);

/**
 * Add select
 */
const withSidebarSelect = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		const { attributes, setAttributes } = props;
		const { hideOnMobile, hideOnTablet, hideOnDesktop } = attributes;

		return (
			<Fragment>
				<BlockEdit {...props} />
				<InspectorControls>
					<PanelBody
						title={__("Visibility", "wafelmedia-utility-blocks")}
						initialOpen={true}
					>
						<ToggleControl
							label={__("Hide on Mobile", "wafelmedia-utility-blocks")}
							checked={hideOnMobile}
							onChange={() => setAttributes({ hideOnMobile: !hideOnMobile })}
						/>
						<ToggleControl
							label={__("Hide on Tablet", "wafelmedia-utility-blocks")}
							checked={hideOnTablet}
							onChange={() => setAttributes({ hideOnTablet: !hideOnTablet })}
						/>
						<ToggleControl
							label={__("Hide on Desktop", "wafelmedia-utility-blocks")}
							checked={hideOnDesktop}
							onChange={() => setAttributes({ hideOnDesktop: !hideOnDesktop })}
						/>
					</PanelBody>
				</InspectorControls>
			</Fragment>
		);
	};
}, "withInspectorControls");

addFilter(
	"editor.BlockEdit",
	"visibility-blocks/with-sidebar-select",
	withSidebarSelect
);

/**
 * Save attribute
 * https://mariecomet.fr/en/2021/12/14/adding-options-controls-existing-gutenberg-block/
 */
const saveSidebarSelectAttribute = (extraProps, blockType, attributes) => {
	const { hideOnMobile, hideOnTablet, hideOnDesktop } = attributes;

	if (hideOnMobile || hideOnTablet || hideOnDesktop) {
		extraProps.className = classnames(extraProps.className, {
			"hide-on-mobile": hideOnMobile,
			"hide-on-tablet": hideOnTablet,
			"hide-on-desktop": hideOnDesktop,
		});
	}
	return extraProps;
};

addFilter(
	"blocks.getSaveContent.extraProps",
	"visibility-blocks/save-sidebar-select-attribute",
	saveSidebarSelectAttribute
);
