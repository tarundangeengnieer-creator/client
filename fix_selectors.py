import re

with open('src/features/dashboard/SecurityOverviewPage.tsx', 'r') as f:
    content = f.read()

# Pattern for the buttons container
pattern_geo = r'<div className="flex items-center bg-slate-100 dark:bg-\[#090e1a\] p-0\.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300">\s*\{\(\[\'7d\', \'30d\', \'90d\'\] as const\)\.map\(\(period\) => \(\s*<button\s*key=\{period\}\s*type="button"\s*onClick=\{\(\) => setSelectedGeoPeriod\(period\)\}\s*className=\{`(.*?)`\}\s*>\s*\{period\.toUpperCase\(\)\}\s*</button>\s*\)\)\}\s*</div>'

replacement_geo = '''<div className="flex items-center gap-1 bg-slate-100/50 dark:bg-slate-900/50 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
                {(['7d', '30d', '90d'] as const).map((period) => (
                  <button
                    key={period}
                    type="button"
                    onClick={() => setSelectedGeoPeriod(period)}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                      selectedGeoPeriod === period
                        ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-sky-400 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    {period.toUpperCase()}
                  </button>
                ))}
              </div>'''

content = re.sub(pattern_geo, replacement_geo, content, flags=re.DOTALL)


pattern_type = r'<div className="flex items-center bg-slate-100 dark:bg-\[#090e1a\] p-0\.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300">\s*\{\(\[\'7d\', \'30d\', \'90d\'\] as const\)\.map\(\(period\) => \(\s*<button\s*key=\{period\}\s*type="button"\s*onClick=\{\(\) => setSelectedTypePeriod\(period\)\}\s*className=\{`(.*?)`\}\s*>\s*\{period\.toUpperCase\(\)\}\s*</button>\s*\)\)\}\s*</div>'

replacement_type = '''<div className="flex items-center gap-1 bg-slate-100/50 dark:bg-slate-900/50 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
              {(['7d', '30d', '90d'] as const).map((period) => (
                <button
                  key={period}
                  type="button"
                  onClick={() => setSelectedTypePeriod(period)}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    selectedTypePeriod === period
                      ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-sky-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  {period.toUpperCase()}
                </button>
              ))}
            </div>'''

content = re.sub(pattern_type, replacement_type, content, flags=re.DOTALL)


pattern_brand = r'<div className="flex items-center bg-slate-100 dark:bg-\[#090e1a\] p-0\.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300">\s*\{\(\[\'7d\', \'30d\', \'90d\'\] as const\)\.map\(\(period\) => \(\s*<button\s*key=\{period\}\s*type="button"\s*onClick=\{\(\) => setSelectedBrandPeriod\(period\)\}\s*className=\{`(.*?)`\}\s*>\s*\{period\.toUpperCase\(\)\}\s*</button>\s*\)\)\}\s*</div>'

replacement_brand = '''<div className="flex items-center gap-1 bg-slate-100/50 dark:bg-slate-900/50 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
              {(['7d', '30d', '90d'] as const).map((period) => (
                <button
                  key={period}
                  type="button"
                  onClick={() => setSelectedBrandPeriod(period)}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    selectedBrandPeriod === period
                      ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-sky-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  {period.toUpperCase()}
                </button>
              ))}
            </div>'''

content = re.sub(pattern_brand, replacement_brand, content, flags=re.DOTALL)


with open('src/features/dashboard/SecurityOverviewPage.tsx', 'w') as f:
    f.write(content)
