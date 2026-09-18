import re

with open('src/features/dashboard/DynamicEmailVolumeGraph.tsx', 'r') as f:
    content = f.read()

# Add timeRange to props
props_pattern = r'interface DynamicEmailVolumeGraphProps \{.*?\}'
props_replacement = '''interface DynamicEmailVolumeGraphProps {
  timeRange?: '24h' | '7d' | '30d' | '90d' | 'custom';
}'''
if 'interface DynamicEmailVolumeGraphProps' in content:
    content = re.sub(props_pattern, props_replacement, content, flags=re.DOTALL)
else:
    content = content.replace('export const DynamicEmailVolumeGraph: React.FC = () => {', 'interface DynamicEmailVolumeGraphProps { timeRange?: string; }\nexport const DynamicEmailVolumeGraph: React.FC<DynamicEmailVolumeGraphProps> = ({ timeRange = "7d" }) => {')

# Remove local timeRange state
content = re.sub(r'  const \[timeRange, setTimeRange\] = useState<.*?>\(\'.*?\'\);\n', '', content)

# Remove local timeRange selector in JSX
selector_pattern = r'            <div className="flex items-center bg-slate-100 dark:bg-\[\#090e1a\] p-0\.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">\s*\{\(\[\'24h\', \'7d\', \'14d\', \'30d\'\] as const\)\.map\(\(r\) => \(.*?\}\s*</button>\s*\)\)\}\s*</div>'
content = re.sub(selector_pattern, '', content, flags=re.DOTALL)

with open('src/features/dashboard/DynamicEmailVolumeGraph.tsx', 'w') as f:
    f.write(content)
