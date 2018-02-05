export const renderStyle = ( content ) => {
	let style = {};
	content && content.Style && content.Style.forEach((item) => {
		switch(item.Name) {
		case 'border':
			style = {...style, ...renderBorder(item)};
			break;
		case 'padding':
		case 'margin':
			style = {...style, ...renderSide(item)};
			break;
		default:
			style[item.Name] = item.Value;
			break;
		}
		
	});
	return style;
}

const renderBorder = (border) => {
	var borderString = ((border.Width || "1px") + " " + (border.Style || "solid") + " " + (border.Color || "black"));
	if(border.Sides && (border.Sides.Top || border.Sides.Bottom || border.Sides.Left || border.Sides.Right)) {
		let borders = {};
		Object.keys(border.Sides).forEach((side) => {
			if(border.Sides[side]) {
				borders["border"+side] = borderString;
			}
		});
		return borders;
	} else {
		return {
			border: borderString
		}
	}
}

const renderSide = (style) => {
	if(style.Sides && (style.Sides.Top || style.Sides.Bottom || style.Sides.Left || style.Sides.Right)) {
		let styles = {};
		Object.keys(style.Sides).forEach((side) => {
			if(style.Sides[side]) {
				styles[style.Name + side] = style.Value;
			}
		});
		return styles;
	} else {
		return {
			[style.Name] : style.Value
		}
	}
}
