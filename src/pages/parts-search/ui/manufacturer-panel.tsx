import { ChevronDown, ChevronUp, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/shared/ui'

import { ManufacturerList } from './manufacturer-list'
import styles from './manufacturer-panel.module.css'

export type ManufacturerPanelProps = {
  manufacturers: string[]
  selectedBrand?: string | null
  onSelect: (brand: string) => void
}

export function ManufacturerPanel({
  manufacturers,
  selectedBrand = null,
  onSelect,
}: ManufacturerPanelProps) {
  const [brandsVisible, setBrandsVisible] = useState(true)

  return (
    <aside
      className={[styles.drawer, brandsVisible ? null : styles.drawerCollapsed]
        .filter(Boolean)
        .join(' ')}
      aria-label="Производители"
    >
      <div className={styles.drawerRail}>
        <Button
          type="button"
          variant="icon"
          size="sm"
          className={styles.toggleDesktop}
          aria-expanded={brandsVisible}
          aria-controls="manufacturers-drawer"
          aria-label={
            brandsVisible ? 'Скрыть производителей' : 'Показать производителей'
          }
          onClick={() => setBrandsVisible((visible) => !visible)}
        >
          {brandsVisible ? (
            <PanelLeftClose size={16} aria-hidden="true" />
          ) : (
            <PanelLeftOpen size={16} aria-hidden="true" />
          )}
        </Button>
      </div>
      <div className={styles.drawerMain}>
        <div className={styles.drawerBar}>
          <h2 className={styles.panelTitle}>Производители</h2>
          <Button
            type="button"
            variant="icon"
            size="sm"
            className={styles.toggleMobile}
            aria-expanded={brandsVisible}
            aria-controls="manufacturers-drawer"
            aria-label={
              brandsVisible ? 'Скрыть производителей' : 'Показать производителей'
            }
            onClick={() => setBrandsVisible((visible) => !visible)}
          >
            {brandsVisible ? (
              <ChevronUp size={16} aria-hidden="true" />
            ) : (
              <ChevronDown size={16} aria-hidden="true" />
            )}
          </Button>
        </div>
        <div
          id="manufacturers-drawer"
          className={styles.drawerBody}
          aria-hidden={!brandsVisible}
          inert={!brandsVisible ? true : undefined}
        >
          <ManufacturerList
            showHeading={false}
            manufacturers={manufacturers}
            selectedBrand={selectedBrand}
            onSelect={onSelect}
          />
        </div>
      </div>
    </aside>
  )
}
