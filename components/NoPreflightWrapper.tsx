import React from "react";

interface NoPreflightWrapperProps {
    children: React.ReactNode;
    className?: string;
}

// ========================================================
// THE SAFE ANTI-PREFLIGHT INLINE SHIELD
// Uses 'revert' to restore the browser's default styles
// without hardcoding broken backgrounds or colors.
// ========================================================
const ANTI_PREFLIGHT_CSS = `
  /* 1. Restore Native Semantic Elements */
  .no-preflight h1 { font-size: revert; font-weight: revert; margin: revert; display: block; }
  .no-preflight h2 { font-size: revert; font-weight: revert; margin: revert; display: block; }
//   .no-preflight h3 { font-size: revert; font-weight: revert; margin: revert; display: block; }
  .no-preflight h4 { font-size: revert; font-weight: revert; margin: revert; display: block; }
  
  .no-preflight p { margin: revert; display: block; }
  
  /* 2. Restore Default List Bullet Formatting */
  .no-preflight ul { list-style-type: revert; padding-inline-start: revert; margin: revert; display: block; }
  .no-preflight ol { list-style-type: revert; padding-inline-start: revert; margin: revert; display: block; }
  .no-preflight li { display: list-item; }

  /* 3. Restore Button and Input Interactivity Defaults */
  .no-preflight button {
    // border: revert;
    // background-color: revert;
    // color: revert;
    // padding: revert;
    text-transform: revert;
    font-family: revert;
    // font-size: revert;
    line-height: revert;
    cursor: pointer;
  }
  
  .no-preflight input {
    // border: revert;
    background-color: revert;
    color: revert;
    // padding: revert;
    font-family: revert;
    // font-size: revert;
    // line-height: revert;
    appearance: auto;
  }
  
  .no-preflight textarea {
    border: revert;
    background-color: revert;
    color: revert;
    padding: revert;
    font-family: revert;
    font-size: revert;
    line-height: revert;
  }
`;


export default function NoPreflightWrapper({
    children,
    className = "",
}: NoPreflightWrapperProps) {
    return (
        <div className={`no-preflight ${className}`}>
            <style dangerouslySetInnerHTML={{ __html: ANTI_PREFLIGHT_CSS }} />
            {children}
        </div>
    );
}