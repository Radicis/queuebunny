// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import AceEditor from 'react-ace';

const styles = () => ({
  container: {
    height: 'calc(100% - 75px)'
  },
  fullHeight: {
    height: '100%'
  },
  editor: {
    height: '100%',
    width: '100%'
  }
});

type Props = {
  handleOk: () => void,
  lightTheme: boolean,
  message: object,
  classes: object
};

class ShowMessage extends Component<Props> {
  props: Props;

  parseContent = content => {
    try {
      return JSON.stringify(JSON.parse(content), null, 2);
    } catch {
      return content;
    }
  };

  render() {
    const { classes, lightTheme, message, handleOk } = this.props;
    return (
      <Dialog open fullScreen>
        <DialogTitle>Message Details</DialogTitle>
        <DialogContent className={classes.fullHeight}>
          <Grid container spacing={24} direction="row" className={classes.container}>
            <Grid item>
              <Typography>Exchange: {message.fields.exchange}</Typography>
              <Typography>RoutingKey: {message.fields.routingKey}</Typography>
              <Typography>Redelivered: {message.fields.redelivered.toString()}</Typography>
              <Typography>DeliveryTag: {message.fields.deliveryTag}</Typography>
            </Grid>
            <Grid item className={classes.editor}>
              <AceEditor
                mode="json"
                theme={lightTheme ? 'github' : 'monokai'}
                name="contents"
                fontSize={12}
                showPrintMargin={false}
                height="100%"
                width="100%"
                highlightActiveLine
                value={this.parseContent(message.content)}
                setOptions={{
                  showLineNumbers: true,
                  tabSize: 2
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleOk} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(ShowMessage);
