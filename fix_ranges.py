import re

with open('/tmp/soc.tsx', 'r') as f:
    lines = f.readlines()
    # strip the prefix numbers like "0: " from my initial dump script if present
    if re.match(r'^\d+: ', lines[0]):
        lines = [re.sub(r'^\d+: ', '', line) for line in lines]

content = "".join(lines)

# 1. Add global selector at the top
header_replacement = '''        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Active Operations Overview</span>
              </h1>
              <button type="button" onClick={() => uiStore.navigate('/inbox')} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer">
                <Mail className="w-3.5 h-3.5" />
                <span>Triage Queue</span>
                <span className="ml-0.5 px-1.5 py-0.5 bg-blue-700/80 border border-blue-400/30 text-white rounded-full text-xs font-mono font-bold">24</span>
              </button>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
              Welcome back, <span className="text-slate-800 dark:text-slate-100 font-medium">{username}</span> • CDGI SOC Partition • Security Posture is{' '}
              <span className={`font-semibold ${activeThreats.postureColor}`}>
                {activeThreats.posture}
              </span>{' '}
              with 24 active cases under triage.
            </p>
          </div>
          
          {/* Global Time Range Selector */}
          <div className="flex items-center self-start sm:self-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c1322] text-xs font-medium text-slate-600 dark:text-slate-400 shadow-2xs"> 
              <Clock className="w-3.5 h-3.5 text-slate-400" /> 
              <span>{currentDateFormatted}</span> 
            </div>
            <div className="relative group">
              <select 
                value={globalTimeRange}
                onChange={(e) => setGlobalTimeRange(e.target.value as any)}
                className="appearance-none bg-white dark:bg-[#0c1322] border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white text-sm font-semibold rounded-lg pl-3 pr-8 py-1.5 shadow-2xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
                <option value="custom">Custom Range</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>'''

content = re.sub(r'        <div>\s*<div className="flex flex-col sm:flex-row sm:items-center gap-3">.*?</div>\s*</div>', header_replacement, content, flags=re.DOTALL)

# 2. Replace state variables
state_vars_pattern = r'  const \[threatPeriod.*?useState\(\'Last 30 days\'\);'
state_vars_replacement = '''  const [globalTimeRange, setGlobalTimeRange] = useState<'24h' | '7d' | '30d' | '90d' | 'custom'>('7d');'''
content = re.sub(state_vars_pattern, state_vars_replacement, content, flags=re.DOTALL)

# 3. Update threatTimeframeData
threatData_pattern = r'  const threatTimeframeData.*?  \};\n\n  const activeThreats = threatTimeframeData\[threatPeriod\];'
threatData_replacement = '''  const threatTimeframeData: Record<
    '24h' | '7d' | '30d' | '90d' | 'custom',
    {
      malicious: { count: number; pct: number };
      suspicious: { count: number; pct: number };
      benign: { count: number; pct: number };
      inconclusive: { count: number; pct: number };
      posture: string;
      postureColor: string;
      postureBg: string;
      postureBorder: string;
      note: string;
    }
  > = {
    '24h': {
      malicious: { count: 8, pct: 31 },
      suspicious: { count: 12, pct: 46 },
      benign: { count: 5, pct: 19 },
      inconclusive: { count: 1, pct: 4 },
      posture: 'Elevated',
      postureColor: 'text-rose-700 dark:text-rose-400',
      postureBg: 'bg-transparent',
      postureBorder: 'border-rose-500/30',
      note: 'Active credential-phishing lures detected during business hours today.',
    },
    '7d': {
      malicious: { count: 48, pct: 32 },
      suspicious: { count: 67, pct: 45 },
      benign: { count: 25, pct: 17 },
      inconclusive: { count: 6, pct: 4 },
      posture: 'Guarded',
      postureColor: 'text-amber-700 dark:text-amber-400',
      postureBg: 'bg-transparent',
      postureBorder: 'border-amber-500/30',
      note: 'Mid-week surge in deceptive banking notification emails contained.',
    },
    '30d': {
      malicious: { count: 185, pct: 33 },
      suspicious: { count: 250, pct: 45 },
      benign: { count: 95, pct: 17 },
      inconclusive: { count: 30, pct: 5 },
      posture: 'Elevated',
      postureColor: 'text-rose-700 dark:text-rose-400',
      postureBg: 'bg-transparent',
      postureBorder: 'border-rose-500/30',
      note: 'Most recent increase is associated with credential-phishing and malicious URL activity.',
    },
    '90d': {
      malicious: { count: 420, pct: 33 },
      suspicious: { count: 580, pct: 46 },
      benign: { count: 215, pct: 17 },
      inconclusive: { count: 50, pct: 4 },
      posture: 'Elevated',
      postureColor: 'text-rose-700 dark:text-rose-400',
      postureBg: 'bg-transparent',
      postureBorder: 'border-rose-500/30',
      note: '90-day baseline shows steady threat containment with 78% automated triage rate.',
    },
    'custom': {
      malicious: { count: 48, pct: 32 },
      suspicious: { count: 67, pct: 45 },
      benign: { count: 25, pct: 17 },
      inconclusive: { count: 6, pct: 4 },
      posture: 'Guarded',
      postureColor: 'text-amber-700 dark:text-amber-400',
      postureBg: 'bg-transparent',
      postureBorder: 'border-amber-500/30',
      note: 'Custom range analytics shown.',
    }
  };

  const activeThreats = threatTimeframeData[globalTimeRange];'''
content = re.sub(threatData_pattern, threatData_replacement, content, flags=re.DOTALL)

# 4. Remove local range selectors from all cards
# Card: Geolocation of Malicious Senders
pattern_geo_buttons = r'<div className="flex items-center gap-1 bg-slate-100/50 dark:bg-slate-900/50 p-1 rounded-lg border border-slate-200 dark:border-slate-800">.*?</div>'
# wait, there are multiple of these in the file.
content = re.sub(pattern_geo_buttons, '', content, flags=re.DOTALL)

with open('src/features/dashboard/SecurityOverviewPage.tsx', 'w') as f:
    f.write(content)
