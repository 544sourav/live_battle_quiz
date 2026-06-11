import { IoGameController, IoTrophy } from "react-icons/io5";
import { BiSolidShieldX } from "react-icons/bi";
import { PiTargetBold } from "react-icons/pi";
import { RiTimerFlashFill } from "react-icons/ri";

export const statsData = [
  {
    id: 1,
    heading: "Total Match",
    icon: IoGameController,
    field: "matchesPlayed",
    color: "#4f37ae",
    shadow: "drop-shadow-[0_0_6px_rgba(79,55,174,0.7)]",
  },

  {
    id: 2,
    heading: "Wins",
    icon: IoTrophy,
    field: "wins",
    color: "#1a7e42",
    shadow: "drop-shadow-[0_0_6px_rgba(26,126,66,0.7)]",
  },

  {
    id: 3,
    heading: "Losses",
    icon: BiSolidShieldX,
    field: "losses",
    color: "#9d2132",
    shadow: "drop-shadow-[0_0_6px_rgba(157,33,50,0.7)]",
  },

  {
    id: 4,
    heading: "Accuracy",
    icon: PiTargetBold,
    field: "averageAccuracy",
    color: "#2360b6",
    shadow: "drop-shadow-[0_0_6px_rgba(35,96,182,0.7)]",
  },

  {
    id: 5,
    heading: "Avg. Response Time",
    icon: RiTimerFlashFill,
    field: "averageResponseTime",
    color: "#d28b14",
    shadow: "drop-shadow-[0_0_6px_rgba(210,139,20,0.7)]",
  },
];
