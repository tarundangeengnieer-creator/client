import re

with open('src/features/dashboard/ThreatDistributionPieChart.tsx', 'r') as f:
    content = f.read()

# Remove threatPeriod and onPeriodChange from props
props_pattern = r'interface ThreatDistributionPieChartProps \{.*?\}'
props_replacement = '''interface ThreatDistributionPieChartProps {
  activeThreats: {
    malicious: { count: number; pct: number };
    suspicious: { count: number; pct: number };
    benign: { count: number; pct: number };
    inconclusive: { count: number; pct: number };
    posture: string;
    postureColor: string;
    postureBg: string;
    postureBorder: string;
    note: string;
  };
}'''
content = re.sub(props_pattern, props_replacement, content, flags=re.DOTALL)

comp_pattern = r'export const ThreatDistributionPieChart: React\.FC<ThreatDistributionPieChartProps> = \(\{\n  threatPeriod,\n  onPeriodChange,\n  activeThreats,\n\}\) => \{'
comp_replacement = '''export const ThreatDistributionPieChart: React.FC<ThreatDistributionPieChartProps> = ({
  activeThreats,
}) => {'''
content = re.sub(comp_pattern, comp_replacement, content)

# Remove chart type state since it should just be donut
state_pattern = r'  const \[chartType, setChartType\] = useState<\'donut\' | \'pie\'>\(\'donut\'\);'
content = re.sub(state_pattern, '', content)

# Replace all occurrences of chartType with 'donut'
content = content.replace('chartType === \'donut\'', 'true')
content = content.replace('chartType === \'pie\'', 'false')

# Remove the header buttons for pie/donut and timeframe
header_buttons_pattern = r'            \{/\* Chart Type Switcher \*/\}.*?            </div>'
content = re.sub(header_buttons_pattern, '', content, flags=re.DOTALL)

with open('src/features/dashboard/ThreatDistributionPieChart.tsx', 'w') as f:
    f.write(content)
