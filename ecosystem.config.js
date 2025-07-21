module.exports = {
  apps: [
    {
      name: "METER MONITORING",
      script: "./node_modules/next/dist/bin/next",
      args: "start -p 5100",
      cwd: "C:/Users/administrator.VTGARMENT/Documents/util_meter",
      env: {
        NODE_ENV: "production"
      }
    },
    {
      name: "NODE-RED",
      script: "start-node-red.bat",       // << ใช้ไฟล์ .bat ของคุณ
      interpreter: "cmd.exe",             // ใช้ interpreter เป็น cmd.exe
      interpreter_args: "/c",             // /c ให้รันคำสั่งแล้วปิด shell
      env: {
        PORT: 1880
      }
    }
  ]
};
