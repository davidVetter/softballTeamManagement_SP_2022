import { Button, ButtonGroup, Box, Chip, Typography, Paper, TextField, Grid, FormGroup, FormLabel, FormControl, MenuItem, InputLabel, Select, List, ListItem, ListItemButton, ListItemText, ListItemIcon, Divider, InboxIcon} from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';

function FullTeam(props) {
  // Convert 10 digit phone number string to (XXX) XXX-XXXX format
  const formatPhone = (phoneNumberString) => {
    const cleaned = ("" + phoneNumberString).replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return "(" + match[1] + ") " + match[2] + "-" + match[3];
    }
    return null;
  };

  return (
    <Box
      sx={{
        flex: "direction",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Paper
        sx={{ mt: 2, mb: 2, width: "100%", maxHeight: 300, overflowY: "auto" }}
      >
        <Typography variant="h5" color="primary" sx={{ padding: 1 }}>
          Full Roster
        </Typography>
        <Divider color="secondary" />
        <List>
          {props.teamPlayers.teamPlayersPersonalInfoReducer.length > 0 &&
            props.teamPlayers.teamPlayersPersonalInfoReducer.map(
              (player, index) => {
                {
                  console.log("this is player each time: ", player);
                }
                return (
                  <ListItem
                    key={index}
                    disablePadding
                    alignItems="flex-start"
                    sx={{ overflowX: "auto" }}
                    style={
                      index % 2
                        ? { background: "#121212" }
                        : { background: "rgba(255, 255, 255, 0.08)" }
                    }
                  >
                    <ListItemButton>
                      <ListItemIcon>
                        <Box
                          sx={{
                            width: "auto",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "start",
                            flexDirection: "column",
                          }}
                        >
                          <Typography
                            color="primary"
                            variant="h6"
                          >{`${player.first_name} ${player.last_name} #${player.number}`}</Typography>
                          <Typography variant="body1">
                            {`Phone: ${formatPhone(player.phone_number)}`}
                          </Typography>
                          <Typography
                            style={{ color: "orange" }}
                            variant="body1"
                          >
                            {`Email: ${player.email}`}
                          </Typography>
                          <Typography
                            color="secondary"
                            variant="body2"
                          >{`Address: ${player.street_address}, ${player.city}, ${player.state} ${player.zip}`}</Typography>
                          <Typography
                            color="secondary"
                            variant="body2"
                          >{`Throws: ${player.throws.toUpperCase()} | Bats: ${player.bats.toUpperCase()} | Jersey: ${player.jersey_size.toUpperCase()}  | Hat: ${player.hat_size.toUpperCase()}`}</Typography>
                        </Box>
                      </ListItemIcon>
                    </ListItemButton>
                  </ListItem>
                );
              }
            )}
        </List>
      </Paper>
    </Box>
  );
}
export default FullTeam;