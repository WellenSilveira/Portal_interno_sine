import './Tabs.css'

export default function Tabs({ activeTab, setActiveTab, tabs }) {
  return (
    <div className="tabs">
      <div className="tabs-header">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tabs-content">
        {tabs.map((tab) => (
          activeTab === tab.id && (
            <div key={tab.id} className="tab-panel">
              {tab.content}
            </div>
          )
        ))}
      </div>
    </div>
  )
}
