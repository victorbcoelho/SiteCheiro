'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { trackEvent } from '@/lib/analytics';
import { diffuserTypes, scents, type DiffuserType } from '@/lib/products';

const MAX_SCENTS = 2;

function DiffuserIllustration({ device }: { device: DiffuserType }) {
  return (
    <svg viewBox="0 0 64 64" className="h-16 w-16 mx-auto">
      <rect
        x="14"
        y="26"
        width="36"
        height="30"
        rx="10"
        fill={device.bodyColor}
        stroke="#E8DDD0"
        strokeWidth="2"
      />
      <path
        d="M32 6c4 6 9 13 9 21a9 9 0 11-18 0c0-8 5-15 9-21z"
        fill={device.accentColor}
      />
    </svg>
  );
}

export default function ProductBuilder() {
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [scentIds, setScentIds] = useState<string[]>([]);

  const toggleScent = (id: string) => {
    setScentIds((current) => {
      if (current.includes(id)) {
        return current.filter((scentId) => scentId !== id);
      }
      if (current.length >= MAX_SCENTS) {
        return current;
      }
      return [...current, id];
    });
  };

  const selectedDevice = diffuserTypes.find((d) => d.id === deviceId);
  const selectedScents = scents.filter((s) => scentIds.includes(s.id));
  const isComplete = Boolean(selectedDevice) && selectedScents.length > 0;

  return (
    <section id="monte" className="section-padding bg-offwhite">
      <div className="container-page">
        <h2 className="font-serif text-3xl md:text-5xl text-center mb-4">
          Monte o seu Sopre
        </h2>
        <p className="text-center text-ink/60 mb-16 max-w-xl mx-auto">
          Escolha a cor do aparelho e até 2 aromas. Você ajusta tudo de novo pelo
          app quando quiser.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_320px] gap-8 items-start">
          <div>
            <h3 className="font-serif text-lg mb-4">1. Cor do aparelho</h3>
            <div className="grid grid-cols-2 gap-4">
              {diffuserTypes.map((device) => (
                <button
                  key={device.id}
                  type="button"
                  onClick={() => setDeviceId(device.id)}
                  className={`rounded-2xl border p-6 text-center transition-colors ${
                    deviceId === device.id
                      ? 'border-rust bg-rust/5'
                      : 'border-sand bg-white hover:border-rust/50'
                  }`}
                >
                  <DiffuserIllustration device={device} />
                  <p className="font-serif text-base mt-4 mb-1">{device.name}</p>
                  <p className="text-xs text-ink/50">{device.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-serif text-lg mb-4">
              2. Aromas <span className="text-ink/40 font-sans text-sm">(até {MAX_SCENTS})</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {scents.map((scent) => {
                const isSelected = scentIds.includes(scent.id);
                const isDisabled = !isSelected && scentIds.length >= MAX_SCENTS;
                return (
                  <button
                    key={scent.id}
                    type="button"
                    onClick={() => toggleScent(scent.id)}
                    disabled={isDisabled}
                    className={`rounded-xl border p-4 text-left transition-colors ${
                      isSelected
                        ? 'border-rust bg-rust/5'
                        : isDisabled
                        ? 'border-sand bg-white opacity-40 cursor-not-allowed'
                        : 'border-sand bg-white hover:border-rust/50'
                    }`}
                  >
                    <p className="text-sm font-medium">{scent.name}</p>
                    <p className="text-xs text-ink/50">{scent.family}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="rounded-3xl bg-ink text-white p-8 sticky top-24"
          >
            <h3 className="font-serif text-xl mb-6">Seu Sopre</h3>

            <div className="space-y-4 mb-8 text-sm">
              <div>
                <p className="text-white/50 mb-1">Aparelho</p>
                <p>{selectedDevice ? selectedDevice.name : 'Selecione uma cor'}</p>
              </div>
              <div>
                <p className="text-white/50 mb-1">Aromas</p>
                {selectedScents.length > 0 ? (
                  <ul className="space-y-1">
                    {selectedScents.map((scent) => (
                      <li key={scent.id}>{scent.name}</li>
                    ))}
                  </ul>
                ) : (
                  <p>Selecione até {MAX_SCENTS} aromas</p>
                )}
              </div>
            </div>

            {isComplete ? (
              <Button
                href="/pre-venda"
                variant="secondary"
                className="w-full"
                onClick={() =>
                  trackEvent('cta_clicked', {
                    cta: 'product_builder',
                    device: selectedDevice?.id ?? null,
                    scents: scentIds,
                  })
                }
              >
                Continuar para o pré-venda
              </Button>
            ) : (
              <Button variant="secondary" className="w-full opacity-40 cursor-not-allowed" disabled>
                Complete sua escolha
              </Button>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
