"use client";
// 登录页面组件
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Message {
  type: "success" | "error" | "warning" | "info";
  content: string;
  id: number;
}

export default function Login() {
  const router = useRouter();
  
  const [disfiex, setDisfiex] = useState(0);
  const [overlaylong, setOverlaylong] = useState("overlaylong");
  const [overlaytitle, setOverlaytitle] = useState("overlaytitle");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: ""
  });
  
  const [registerForm, setRegisterForm] = useState({
    username: "",
    password: ""
  });

  const isLoginMode = disfiex === 0;

  const Signin = () => {
    setOverlaylong("overlaylongleft");
    setOverlaytitle("overlaytitleright");
    setTimeout(() => {
      setDisfiex(1);
    }, 200);
  };

  const Signup = () => {
    setOverlaylong("overlaylongright");
    setOverlaytitle("overlaytitleleft");
    setTimeout(() => {
      setDisfiex(0);
    }, 200);
  };

  const showMessage = (type: "success" | "error" | "warning" | "info", content: string) => {
    const id = Date.now();
    setMessages(prev => [...prev, { type, content, id }]);
    setTimeout(() => {
      setMessages(prev => prev.filter(m => m.id !== id));
    }, 3000);
  };

  const handleLogin = async () => {
    if (!loginForm.username || !loginForm.password) {
      showMessage("warning", "请输入用户名和密码");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: loginForm.username,
          password: loginForm.password,
        }),
      });

      const result = await response.json();

      if (result.code === 0) {
        showMessage("success", "登录成功");
        localStorage.setItem("token", result.data.accessToken);
        // 跳转到首页
        router.push("/");
      } else {
        showMessage("error", result.message || "登录失败");
      }
    } catch (error) {
      showMessage("error", "登录失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!registerForm.username || !registerForm.password) {
      showMessage("warning", "请输入用户名和密码");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: registerForm.username,
          password: registerForm.password,
        }),
      });

      const result = await response.json();

      if (result.code === 0) {
        showMessage("success", "注册成功");
        localStorage.setItem("token", result.data.accessToken);
        // 注册后跳转到首页
        router.push("/");
      } else {
        showMessage("error", result.message || "注册失败");
      }
    } catch (error) {
      showMessage("error", "注册失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    showMessage("info", "忘记密码功能开发中...");
  };

  return (
    <div className="center">
      <h1>{isLoginMode ? "Sign in" : "Sign up"}</h1>
      <div className="logon">
        <div className={overlaylong}>
          {disfiex === 0 && (
            <div className="overlaylong-Signin">
              <h2 className="overlaylongH2">Sign in</h2>
              <input
                type="text"
                placeholder="用户名"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
              <input
                type="password"
                placeholder="密码"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
              <h3 onClick={handleForgotPassword}>忘记密码？</h3>
              <button
                className="inupbutton"
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? "登录中..." : "Sign in"}
              </button>
            </div>
          )}
          
          {disfiex === 1 && (
            <div className="overlaylong-Signup">
              <h2 className="overlaylongH2">Registered Account</h2>
              <input
                type="text"
                placeholder="用户名"
                value={registerForm.username}
                onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && handleRegister()}
              />
              <input
                type="password"
                placeholder="密码"
                value={registerForm.password}
                onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && handleRegister()}
              />
              <button
                className="inupbutton"
                onClick={handleRegister}
                disabled={loading}
              >
                {loading ? "注册中..." : "Sign up"}
              </button>
            </div>
          )}
        </div>
        
        <div className={overlaytitle}>
          {disfiex === 0 && (
            <div className="overlaytitle-Signin">
              <h2 className="overlaytitleH2">Hello,Friend!</h2>
              <p className="overlaytitleP">
                Enter your personal details and start journey with us
              </p>
              <div className="buttongohs" onClick={Signin}>Sign up</div>
            </div>
          )}
          
          {disfiex === 1 && (
            <div className="overlaytitle-Signup">
              <h2 className="overlaytitleH2">Welcome Back!</h2>
              <p className="overlaytitleP">To keep connected with us please login with your personal info</p>
              <div className="buttongohs" onClick={Signup}>Sign in</div>
            </div>
          )}
        </div>
      </div>
      
      <div className="message-container">
        {messages.map((msg) => (
          <div key={msg.id} className={`message message-${msg.type}`}>
            {msg.content}
          </div>
        ))}
      </div>
      
      <style>{`
        .center {
          width: 100vw;
          height: 100vh;
          background-image: url('https://gd-hbimg.huaban.com/9165dc3c0f8279ae5402d1f47212847bff68b49f3cb547-QEli8R');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          overflow: hidden;
        }

        h1 {
          font-size: 30px;
          color: black;
        }

        .logon {
          background-color: #fff;
          border-radius: 10px;
          box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
          width: 768px;
          max-width: 100%;
          min-height: 480px;
          margin-top: 20px;
          display: flex;
          background: -webkit-linear-gradient(right, #4284db, #29eac4);
        }

        .overlaylong {
          border-radius: 10px 0 0 10px;
          width: 50%;
          height: 100%;
          background-color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .overlaylongleft {
          border-radius: 0px 10px 10px 0px;
          width: 50%;
          height: 100%;
          background-color: #fff;
          transform: translateX(100%);
          transition: transform 0.6s ease-in-out;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .overlaylongright {
          border-radius: 10px 0 0 10px;
          width: 50%;
          height: 100%;
          background-color: #fff;
          transform: translateX(0%);
          transition: transform 0.6s ease-in-out;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .overlaytitle {
          border-radius: 0px 10px 10px 0px;
          width: 50%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .overlaytitleH2 {
          font-size: 30px;
          color: #fff;
          margin-top: 20px;
        }

        .overlaytitleP {
          font-size: 15px;
          color: #fff;
          margin-top: 20px;
          text-align: center;
          padding: 0 20px;
        }

        .overlaytitleleft {
          border-radius: 0px 10px 10px 0px;
          width: 50%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0);
          display: flex;
          align-items: center;
          justify-content: center;
          transform: translateX(0%);
          transition: transform 0.6s ease-in-out;
        }

        .overlaytitleright {
          border-radius: 0px 10px 10px 0px;
          width: 50%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0);
          display: flex;
          align-items: center;
          justify-content: center;
          transform: translateX(-100%);
          transition: transform 0.6s ease-in-out;
        }

        .overlaytitle-Signin {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
        }

        .overlaytitle-Signup {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
        }

        .buttongohs {
          width: 180px;
          height: 40px;
          border-radius: 50px;
          border: 1px solid #fff;
          color: #fff;
          font-size: 15px;
          text-align: center;
          line-height: 40px;
          margin-top: 40px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .buttongohs:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }

        .overlaylongH2 {
          font-size: 25px;
          color: black;
        }

        .overlaylong-Signin {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
        }

        .overlaylong-Signup {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
        }

        input {
          background-color: #eee;
          border: none;
          padding: 12px 15px;
          margin: 10px 0;
          width: 240px;
          border-radius: 5px;
          outline: none;
          transition: all 0.3s;
        }

        input:focus {
          background-color: #fff;
          box-shadow: 0 0 0 2px #4284db;
        }

        h3 {
          font-size: 12px;
          margin-top: 10px;
          cursor: pointer;
          color: #666;
        }

        h3:hover {
          color: #4284db;
        }

        .inupbutton {
          background-color: #29eac4;
          border: none;
          width: 180px;
          height: 40px;
          border-radius: 50px;
          font-size: 15px;
          color: #fff;
          text-align: center;
          line-height: 40px;
          margin-top: 30px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .inupbutton:hover:not(:disabled) {
          background-color: #20d4b0;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(41, 234, 196, 0.4);
        }

        .inupbutton:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .message-container {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .message {
          padding: 12px 20px;
          border-radius: 6px;
          color: white;
          font-size: 14px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          animation: slideIn 0.3s ease-out;
        }

        .message-success {
          background-color: #67c23a;
        }

        .message-error {
          background-color: #f56c6c;
        }

        .message-warning {
          background-color: #e6a23c;
        }

        .message-info {
          background-color: #909399;
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
