import re

with open('src/features/dashboard/SecurityOverviewPage.tsx', 'r') as f:
    content = f.read()

# 1. Update Header to H1 and move button
header_pattern = r'      \{/\* Header with Title, Status and Aligned Primary Actions \*/\}.*?<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 mb-6 border-b border-slate-200/80 dark:border-slate-800/80">.*?<div>.*?<div className="flex flex-col sm:flex-row sm:items-center gap-3"><h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">.*?<span>Active Operations Overview</span>          </h2>.*?<p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">.*?Welcome back, <span className="text-slate-800 dark:text-slate-100 font-medium">\{username\}</span> • CDGI SOC Partition • Security Posture is\{\' \'\}            <span className=\{`font-semibold \$\{activeThreats\.postureColor\}`\}>              \{activeThreats\.posture\}            </span>\{\' \'\}            with 24 active cases under triage.          </p>        </div>        <div className="flex items-center gap-2\.5 shrink-0 self-start md:self-center">          <div className="hidden sm:flex items-center gap-1\.5 px-3 py-1\.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-\[#0c1322\] text-xs font-medium text-slate-600 dark:text-slate-400 shadow-2xs">            <Clock className="w-3\.5 h-3\.5 text-slate-400" />            <span>\{currentDateFormatted\}</span>          </div>          <button            type="button"            onClick=\{.. => uiStore\.navigate.../inbox...\}            className="flex items-center gap-2 px-3\.5 py-1\.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"          >            <Mail className="w-3\.5 h-3\.5" />        </div>      </div>'

# Just do simple string replacements for the parts that are wrong:
content = content.replace('<div className="flex flex-col sm:flex-row sm:items-center gap-3"><h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">\n            <span>Active Operations Overview</span>\n          </h2>', '<div className="flex flex-col sm:flex-row sm:items-center gap-3"><h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">\n            <span>Active Operations Overview</span>\n          </h1><button type="button" onClick={() => uiStore.navigate(\'/inbox\')} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"><Mail className="w-3.5 h-3.5" /><span>Triage Queue</span><span className="ml-0.5 px-1.5 py-0.5 bg-blue-700/80 border border-blue-400/30 text-white rounded-full text-xs font-mono font-bold">24</span></button></div>')

# Remove the broken button remnants
content = content.replace('          <button\n            type="button"\n            onClick={() => uiStore.navigate(\'/inbox\')}\n            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"\n          >\n            <Mail className="w-3.5 h-3.5" />\n        </div>', '        </div>')


# 2. Fix Text Sizes for td
content = content.replace('text-[11px]', 'text-xs')

# 3. Simplify KPI cards
content = content.replace('<span className="text-xs font-semibold text-blue-600 dark:text-sky-400 uppercase tracking-wider">\n                ACTIVE TRIAGE QUEUE\n              </span>', '<span className="text-sm font-medium text-slate-600 dark:text-slate-400">\n                Active Triage Queue\n              </span>')
content = content.replace('<div className="text-3xl font-extrabold text-blue-600 dark:text-sky-400 mt-1 font-mono tracking-tight">', '<div className="text-4xl lg:text-5xl font-extrabold text-blue-600 dark:text-sky-400 mt-1 font-mono tracking-tight">')

content = content.replace('<span className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider">\n                HIGH-CONFIDENCE THREATS\n              </span>', '<span className="text-sm font-medium text-slate-600 dark:text-slate-400">\n                High-Confidence Threats\n              </span>')
content = content.replace('<div className="text-3xl font-extrabold text-rose-600 dark:text-rose-400 mt-1 font-mono tracking-tight">', '<div className="text-4xl lg:text-5xl font-extrabold text-rose-600 dark:text-rose-400 mt-1 font-mono tracking-tight">')

content = content.replace('<span className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider">\n                SUSPICIOUS LURES\n              </span>', '<span className="text-sm font-medium text-slate-600 dark:text-slate-400">\n                Suspicious Lures\n              </span>')
content = content.replace('<div className="text-3xl font-extrabold text-amber-700 dark:text-amber-400 mt-1 font-mono tracking-tight">', '<div className="text-4xl lg:text-5xl font-extrabold text-amber-700 dark:text-amber-400 mt-1 font-mono tracking-tight">')

content = content.replace('<span className="text-xs font-semibold text-blue-600 dark:text-sky-400 uppercase tracking-wider">\n                ACTIVE IN-FLIGHT\n              </span>', '<span className="text-sm font-medium text-slate-600 dark:text-slate-400">\n                Active In-Flight\n              </span>')
# The 4th card has this class for number
content = content.replace('<div className="text-3xl font-extrabold text-blue-600 dark:text-sky-400 mt-1 font-mono tracking-tight">', '<div className="text-4xl lg:text-5xl font-extrabold text-blue-600 dark:text-sky-400 mt-1 font-mono tracking-tight">') # already done by first replace if it's identical, wait, first one already replaces all if not restricted.

# Remove the secondary badges
badge1 = '''              <div className="flex items-center gap-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/50 text-blue-700 dark:text-sky-400 text-xs font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Triage Active
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </div>'''
content = content.replace(badge1, '''              <div className="flex items-center gap-1">
                <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </div>''')

badge2 = '''              <div className="flex items-center gap-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-800/50 text-rose-700 dark:text-rose-400 text-xs font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  Action Required
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </div>'''
content = content.replace(badge2, '''              <div className="flex items-center gap-1">
                <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </div>''')

badge3 = '''              <div className="flex items-center gap-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/50 text-amber-700 dark:text-amber-400 text-xs font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  Monitoring
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </div>'''
content = content.replace(badge3, '''              <div className="flex items-center gap-1">
                <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </div>''')

badge4 = '''              <div className="flex items-center gap-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/50 text-blue-700 dark:text-sky-400 text-xs font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Processing
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </div>'''
content = content.replace(badge4, '''              <div className="flex items-center gap-1">
                <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </div>''')


# 4. Remove AI Copilot Card and change grid-cols-3 to grid-cols-2
content = content.replace('grid-cols-1 md:grid-cols-3', 'grid-cols-1 md:grid-cols-2')

# Use regex to remove Card 3
card3_pattern = r'        \{/\* Card 3: AI Copilot Quick Assist \*/\}.*?          </div>\n        </div>'
content = re.sub(card3_pattern, '', content, flags=re.DOTALL)


with open('src/features/dashboard/SecurityOverviewPage.tsx', 'w') as f:
    f.write(content)
