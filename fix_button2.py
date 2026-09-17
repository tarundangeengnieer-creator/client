with open('src/features/dashboard/SecurityOverviewPage.tsx', 'r') as f:
    lines = f.readlines()

new_lines = []
skip = False
for i, line in enumerate(lines):
    if '<button' in line and 'uiStore.navigate(\'/inbox\')' in line and i > 175 and i < 195:
        skip = True
    if skip:
        if '<Mail className="w-3.5 h-3.5" />' in line:
            skip = False
        continue
    new_lines.append(line)

with open('src/features/dashboard/SecurityOverviewPage.tsx', 'w') as f:
    f.writelines(new_lines)
