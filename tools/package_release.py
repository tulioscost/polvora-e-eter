from pathlib import Path
from zipfile import ZipFile,ZIP_DEFLATED
import json
root=Path(__file__).resolve().parents[1]
base=root.parent
version=json.loads((root/'system.json').read_text())['version']
release=base/f'Polvora_e_Eter_Foundry_14.369_v{version}.zip'
source=base/f'Polvora_e_Eter_GitHub_tulioscost_v{version}.zip'
manifest=base/'Polvora_e_Eter_system.json'
manifest.write_bytes((root/'system.json').read_bytes())
run_paths=['system.json','template.json','README.md','LICENSE']
for dirname in ['module','templates','styles','assets','data','lang']:
    run_paths.extend(str(p.relative_to(root)) for p in (root/dirname).rglob('*') if p.is_file())
with ZipFile(release,'w',compression=ZIP_DEFLATED,compresslevel=8) as z:
    for f in run_paths:z.write(root/f,arcname=f)
with ZipFile(source,'w',compression=ZIP_DEFLATED,compresslevel=8) as z:
    for p in root.rglob('*'):
        if p.is_file() and '__pycache__' not in p.parts:
            z.write(p,arcname=str(Path('polvora-e-eter')/p.relative_to(root)))
# Validate packaging: package root, no dummy dirs, no missing assets.
with ZipFile(release) as z:
    files=set(z.namelist()); assert 'system.json' in files and 'template.json' in files and 'module/main.mjs' in files
    assert all(f'assets/dice/d6-{i}.webp' in files for i in range(1,7))
    assert all(f'data/{n}.json' in files for n in ['weapons','equipment','talents','rituals','enemies','book','pregens'])
with ZipFile(source) as z:
    assert 'polvora-e-eter/.github/workflows/release.yml' in z.namelist()
    assert 'polvora-e-eter/publicar-no-github.ps1' in z.namelist()
for f in [release,source,manifest]:print(f, f.stat().st_size)
