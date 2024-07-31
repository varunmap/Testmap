import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { SxProps, Theme } from "@mui/system";

type Props = {
  top?: number;
  smooth?: boolean;
  svgPath?: string;
  viewBox?: string;
  component?: React.ReactNode;
  width?: string;
  height?: string;
  color?: string;
  sx?: SxProps<Theme>;
};
const handleScrollToTop =(smooth: boolean = false) =>{

  if (smooth) {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  } else {
    document.documentElement.scrollTop = 0;
  }
}

const ScrollToTop: React.FC<Props> = ({
  top = 20,
  smooth = false,
  component,
  viewBox = "0 0 256 256",
  svgPath = "M222.138,91.475l-89.6-89.6c-2.5-2.5-6.551-2.5-9.051,0l-89.6,89.6c-2.5,2.5-2.5,6.551,0,9.051s6.744,2.5,9.244,0L122,21.85  V249.6c0,3.535,2.466,6.4,6,6.4s6-2.865,6-6.4V21.85l78.881,78.676c1.25,1.25,2.992,1.875,4.629,1.875s3.326-0.625,4.576-1.875  C224.586,98.025,224.638,93.975,222.138,91.475z",
  width = "28",
  height = "28",
  color = "black",
  sx,
  ...props
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(document.documentElement.scrollTop >= top);
    };
    onScroll();
    document.addEventListener("scroll", onScroll);
    return () => document.removeEventListener("scroll", onScroll);
  }, [top]);

  const buttonSx: SxProps<Theme> = {
    backgroundColor: "white",
    right: "40px",
    bottom: "40px",
    position: "fixed",
    zIndex: 2,
    cursor: "pointer",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    boxShadow: "0 9px 25px 0 rgba(132, 128, 177, 0.28)",
    border: "none",
    "&:active": {
      transform: "matrix(0.95, 0, 0, 0.95, 0, 0)",
    },
    ...sx,
  };

  return (
    <>
      {visible && (
        <Button
          className="scroll-to-top"
          onClick={() => handleScrollToTop(smooth)}
          aria-label="Scroll to top"
          sx={buttonSx}
          {...props}
        >
          {component || (
            <svg width={width} height={height} fill={color} viewBox={viewBox}>
              <path d={svgPath} />
            </svg>
          )}
        </Button>
      )}
    </>
  );
};

export default ScrollToTop;
