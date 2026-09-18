import re

with open('src/features/investigation/ForensicWorkflowModal.tsx', 'r') as f:
    content = f.read()

# Make sure we have CheckCircle2 imported
if 'CheckCircle2' not in content:
    content = content.replace("import {", "import { CheckCircle2,", 1)

content = content.replace("? 'border-blue-500 bg-slate-100 dark:bg-slate-800/80 shadow-xs'", "? 'border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800/80 shadow-xs'")
content = content.replace(": 'border-slate-200 dark:border-slate-800 hover:border-blue-300 bg-white dark:bg-slate-900/80'", ": 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/80'")

def replacer(match):
    return (
        '<div className="flex items-start justify-between gap-2">\n'
        + match.group(1) + '<div className="flex items-start gap-2 min-w-0">\n'
        + match.group(1) + '  {selectedSpecimen?.id === specimen.id && <CheckCircle2 className="w-4 h-4 text-slate-700 dark:text-slate-300 shrink-0 mt-0.5" />}\n'
        + match.group(1) + '  <div className="min-w-0">\n'
        + match.group(1) + '    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">\n'
        + match.group(1) + '      {specimen.subject}\n'
        + match.group(1) + '    </p>\n'
        + match.group(1) + '    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">\n'
        + match.group(1) + '      From: {specimen.sender}' + match.group(2) + '\n'
        + match.group(1) + '    </p>\n'
        + match.group(1) + '  </div>\n'
        + match.group(1) + '</div>'
    )

pattern = re.compile(
    r'<div className="flex items-start justify-between gap-2">\n(\s*)<div className="min-w-0">\n\s*<p className="text-xs font-bold text-slate-900 dark:text-white truncate">\n\s*\{specimen\.subject\}\n\s*</p>\n\s*<p className="text-\[11px\] text-slate-500 dark:text-slate-400 truncate mt-0\.5">\n\s*From: \{specimen\.sender\}(.*?)\n\s*</p>\n\s*</div>'
)

new_content = pattern.sub(replacer, content)

with open('src/features/investigation/ForensicWorkflowModal.tsx', 'w') as f:
    f.write(new_content)

print(len(new_content) != len(content))
