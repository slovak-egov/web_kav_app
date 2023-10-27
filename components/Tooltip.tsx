import { attributesToProps } from 'html-react-parser';
import { Tooltip as MaterialTooltip } from '@mui/material';
import { UAParser } from 'ua-parser-js';
import { useEffect, useState } from 'react';
import ClickAwayListener from '@mui/material/ClickAwayListener';

function Tooltip({ title, attribs, classes, ...props }) {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const handleClickAwayEvent = () => {
    setOpen(false);
  };

  const handleClickEvent = () => {
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    let currentDeviceType;

    if (!!navigator?.userAgent) {
      const parser = new UAParser(navigator.userAgent);
      currentDeviceType = parser?.getDevice().type;
    }

    setIsMobile(currentDeviceType === 'mobile');
  }, []);

  if (isMobile) {
    return (
      <ClickAwayListener onClickAway={handleClickAwayEvent}>
        <div className="inline">
          <MaterialTooltip
            describeChild
            arrow
            open={open}
            disableFocusListener
            disableHoverListener
            disableTouchListener
            title={title}
            classes={classes}
          >
            <abbr
              tabIndex={0}
              {...attributesToProps(attribs)}
              className="focusable"
              onClick={handleClickEvent}
            >
              {props.children}
            </abbr>
          </MaterialTooltip>
        </div>
      </ClickAwayListener>
    );
  } else {
    return (
      <MaterialTooltip describeChild arrow placement="right" title={title} classes={classes}>
        <abbr tabIndex={0} {...attributesToProps(attribs)} className="focusable">
          {props.children}
        </abbr>
      </MaterialTooltip>
    );
  }
}

export default Tooltip;
