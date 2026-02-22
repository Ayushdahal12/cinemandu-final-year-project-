import { useState, useEffect } from "react";
import { useAppContext } from "../../context/appcontext";
import toast from "react-hot-toast";

const CinePoints = () => {
  const { axios, getToken, user } = useAppContext();
  const [points, setPoints] = useState(0);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);

  const CLAIM_THRESHOLD = 200;
  const progress = Math.min((points / CLAIM_THRESHOLD) * 100, 100);
  const canClaim = points >= CLAIM_THRESHOLD;

  const fetchPoints = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/cinepoints", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setPoints(data.points);
        setHistory(data.history || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async () => {
    if (!canClaim) return;
    setClaiming(true);
    try {
      const token = await getToken();
      const { data } = await axios.post(
        "/api/cinepoints/claim",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success(data.message);
        fetchPoints();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Something went wrong!");
    } finally {
      setClaiming(false);
    }
  };

  useEffect(() => {
    if (user) fetchPoints();
  }, [user]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');
        .cp-page { min-height: 100vh; background: #080c14; color: white; font-family: 'DM Sans', sans-serif; padding: 100px 20px 40px; position: relative; overflow: hidden; }
        .cp-bg-glow { position: absolute; width: 600px; height: 600px; background: radial-gradient(circle, rgba(245,197,24,0.06) 0%, transparent 70%); top: -100px; left: 50%; transform: translateX(-50%); pointer-events: none; }
        .cp-container { max-width: 800px; margin: 0 auto; position: relative; z-index: 1; }
        .cp-header { text-align: center; margin-bottom: 50px; }
        .cp-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(245,197,24,0.1); border: 1px solid rgba(245,197,24,0.3); color: #f5c518; padding: 6px 18px; border-radius: 50px; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 20px; }
        .cp-title { font-family: 'Bebas Neue', cursive; font-size: clamp(60px, 10vw, 100px); color: #fff; line-height: 1; margin: 0; letter-spacing: 4px; }
        .cp-title span { color: #f5c518; }
        .cp-subtitle { color: rgba(255,255,255,0.4); font-size: 16px; margin-top: 12px; }
        .cp-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }
        .cp-stat { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 24px; text-align: center; }
        .cp-stat-number { font-family: 'Bebas Neue', cursive; font-size: 40px; color: #f5c518; line-height: 1; }
        .cp-stat-label { color: rgba(255,255,255,0.4); font-size: 12px; letter-spacing: 2px; text-transform: uppercase; margin-top: 6px; }
        .cp-main-card { background: linear-gradient(135deg, rgba(245,197,24,0.08), rgba(245,197,24,0.02)); border: 1px solid rgba(245,197,24,0.2); border-radius: 24px; padding: 48px; text-align: center; margin-bottom: 24px; position: relative; overflow: hidden; }
        .cp-main-card::before { content: '★'; position: absolute; font-size: 300px; color: rgba(245,197,24,0.03); top: -80px; right: -60px; line-height: 1; }
        .cp-points-label { color: rgba(255,255,255,0.4); font-size: 12px; letter-spacing: 4px; text-transform: uppercase; margin-bottom: 12px; }
        .cp-points-number { font-family: 'Bebas Neue', cursive; font-size: clamp(80px, 15vw, 140px); color: #f5c518; line-height: 1; margin: 0; text-shadow: 0 0 60px rgba(245,197,24,0.3); }
        .cp-points-sub { color: rgba(255,255,255,0.4); font-size: 14px; margin-top: 8px; }
        .cp-progress-section { margin-top: 36px; }
        .cp-progress-labels { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 13px; }
        .cp-progress-labels span:first-child { color: rgba(255,255,255,0.5); }
        .cp-progress-labels span:last-child { color: #f5c518; font-weight: 600; }
        .cp-progress-bar { width: 100%; height: 10px; background: rgba(255,255,255,0.08); border-radius: 50px; overflow: hidden; }
        .cp-progress-fill { height: 100%; background: linear-gradient(90deg, #f5c518, #ffed4a); border-radius: 50px; transition: width 1s ease; }
        .cp-progress-message { text-align: center; margin-top: 12px; font-size: 13px; color: rgba(255,255,255,0.4); }
        .cp-progress-message.ready { color: #00e676; font-weight: 600; }
        .cp-claim-btn { width: 100%; padding: 20px; border-radius: 16px; border: none; background: linear-gradient(135deg, #f5c518, #e6a800); color: #000; font-family: 'Bebas Neue', cursive; font-size: 22px; letter-spacing: 3px; cursor: pointer; transition: all 0.3s ease; margin-top: 24px; }
        .cp-claim-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 20px 60px rgba(245,197,24,0.3); }
        .cp-claim-btn:disabled { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.3); cursor: not-allowed; }
        .cp-history { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; overflow: hidden; margin-bottom: 24px; }
        .cp-history-header { padding: 20px 24px; border-bottom: 1px solid rgba(255,255,255,0.06); color: rgba(255,255,255,0.4); font-size: 11px; letter-spacing: 3px; text-transform: uppercase; }
        .cp-history-item { padding: 16px 24px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.04); }
        .cp-history-item:last-child { border-bottom: none; }
        .cp-history-reason { color: rgba(255,255,255,0.7); font-size: 14px; }
        .cp-history-date { color: rgba(255,255,255,0.3); font-size: 12px; margin-top: 2px; }
        .cp-history-points { font-family: 'Bebas Neue', cursive; font-size: 22px; }
        .cp-history-points.positive { color: #00e676; }
        .cp-history-points.negative { color: #ff6b6b; }
        .cp-empty { padding: 40px; text-align: center; color: rgba(255,255,255,0.3); font-size: 14px; }
        .cp-how { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 28px; }
        .cp-how-title { font-family: 'Bebas Neue', cursive; font-size: 20px; letter-spacing: 2px; color: rgba(255,255,255,0.5); margin-bottom: 20px; }
        .cp-how-steps { display: flex; gap: 16px; flex-wrap: wrap; }
        .cp-how-step { flex: 1; min-width: 160px; display: flex; align-items: flex-start; gap: 12px; }
        .cp-how-icon { font-size: 24px; flex-shrink: 0; }
        .cp-how-text h4 { color: rgba(255,255,255,0.8); font-size: 14px; font-weight: 600; margin: 0 0 4px; }
        .cp-how-text p { color: rgba(255,255,255,0.35); font-size: 12px; margin: 0; line-height: 1.5; }
        .loading-spinner { display: flex; justify-content: center; align-items: center; min-height: 60vh; }
        .spinner { width: 50px; height: 50px; border: 3px solid rgba(245,197,24,0.2); border-top-color: #f5c518; border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 600px) { .cp-stats { grid-template-columns: repeat(2, 1fr); } .cp-main-card { padding: 32px 24px; } }
      `}</style>

      <div className="cp-page">
        <div className="cp-bg-glow" />
        {loading ? (
          <div className="loading-spinner"><div className="spinner" /></div>
        ) : (
          <div className="cp-container">
            <div className="cp-header">
              <div className="cp-badge">⭐ Loyalty Rewards</div>
              <h1 className="cp-title">CINE<span>POINTS</span></h1>
              <p className="cp-subtitle">Book tickets, earn points, get free movies!</p>
            </div>

            <div className="cp-stats">
              <div className="cp-stat">
                <div className="cp-stat-number">{points}</div>
                <div className="cp-stat-label">Total Points</div>
              </div>
              <div className="cp-stat">
                <div className="cp-stat-number">{Math.floor(points / 10)}</div>
                <div className="cp-stat-label">Tickets Booked</div>
              </div>
              <div className="cp-stat">
                <div className="cp-stat-number">{Math.floor(points / 200)}</div>
                <div className="cp-stat-label">Free Tickets</div>
              </div>
            </div>

            <div className="cp-main-card">
              <p className="cp-points-label">Your CinePoints Balance</p>
              <p className="cp-points-number">{points}</p>
              <p className="cp-points-sub">
                {canClaim ? "🎉 You can claim a free ticket!" : `${CLAIM_THRESHOLD - points} more points needed`}
              </p>
              <div className="cp-progress-section">
                <div className="cp-progress-labels">
                  <span>0 pts</span>
                  <span>🎟️ 200 pts = Free Ticket</span>
                </div>
                <div className="cp-progress-bar">
                  <div className="cp-progress-fill" style={{ width: `${progress}%` }} />
                </div>
                <p className={`cp-progress-message ${canClaim ? "ready" : ""}`}>
                  {canClaim ? "✅ Ready to claim!" : `${Math.round(progress)}% complete`}
                </p>
              </div>
              <button className="cp-claim-btn" onClick={handleClaim} disabled={!canClaim || claiming}>
                {claiming ? "Claiming..." : canClaim ? "🎟️ Claim Free Ticket" : `Need ${CLAIM_THRESHOLD - points} More Points`}
              </button>
            </div>

            <div className="cp-history">
              <div className="cp-history-header">Points History</div>
              {history.length === 0 ? (
                <div className="cp-empty">No points yet. Book a ticket to earn points! 🎬</div>
              ) : (
                [...history].reverse().map((item, i) => (
                  <div key={i} className="cp-history-item">
                    <div>
                      <div className="cp-history-reason">{item.reason}</div>
                      <div className="cp-history-date">{new Date(item.date).toLocaleDateString()}</div>
                    </div>
                    <div className={`cp-history-points ${item.points > 0 ? "positive" : "negative"}`}>
                      {item.points > 0 ? "+" : ""}{item.points} pts
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="cp-how">
              <div className="cp-how-title">HOW IT WORKS</div>
              <div className="cp-how-steps">
                <div className="cp-how-step">
                  <div className="cp-how-icon">🎟️</div>
                  <div className="cp-how-text"><h4>Book a Ticket</h4><p>Every ticket earns CinePoints automatically</p></div>
                </div>
                <div className="cp-how-step">
                  <div className="cp-how-icon">⭐</div>
                  <div className="cp-how-text"><h4>Earn 10 Points</h4><p>Each ticket = 10 CinePoints added</p></div>
                </div>
                <div className="cp-how-step">
                  <div className="cp-how-icon">🎁</div>
                  <div className="cp-how-text"><h4>Claim Free Ticket</h4><p>200 points = 1 completely free ticket!</p></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CinePoints;