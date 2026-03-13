import {
    BarChartOutlined,
    TeamOutlined,
    HeartOutlined,
    WarningOutlined,
    SettingOutlined
  } from "@ant-design/icons";
  import { NavLink } from "react-router-dom";
  
  export default function Sidebar() {
    return (
      <div style={{ padding: 20 }}>
        <h2>MindMatch</h2>
  
        <nav>
          <NavLink to="/"> <BarChartOutlined /> Dashboard</NavLink>
          <NavLink to="/users"> <TeamOutlined /> Users</NavLink>
          <NavLink to="/matches"> <HeartOutlined /> Matches</NavLink>
          <NavLink to="/reports"> <WarningOutlined /> Reports</NavLink>
          <NavLink to="/settings"> <SettingOutlined /> Settings</NavLink>
        </nav>
      </div>
    );
  }