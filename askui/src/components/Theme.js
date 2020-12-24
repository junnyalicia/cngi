import React from "react";
import {createMuiTheme, useMediaQuery} from "@material-ui/core";
import {makeStyles} from "@material-ui/styles";

export function useNwafuTheme() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  return React.useMemo(
      () => createMuiTheme({
        palette: {
          type: prefersDarkMode ? 'dark' : 'light',
          primary: {main: '#286039'},
          secondary: {main: '#9a7c48'},
          copyrightBackground: (prefersDarkMode ? '#3f3f3f' : '#f3f3f3'),
        },
      }),
      [prefersDarkMode],
  );
}

export function useFooterBackgroundColor() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  return React.useMemo(
      () => makeStyles(() => ({
        footer: {
          backgroundColor: prefersDarkMode ? '#3f3f3f' : '#f3f3f3'
        }
      })),
      [prefersDarkMode],
  );
}
