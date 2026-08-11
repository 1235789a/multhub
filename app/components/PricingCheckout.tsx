"use client";

import { useEffect, useState } from "react";
import { ServicePlanCard } from "./ContentCards";
import { UsdtCheckout } from "./UsdtCheckout";
import { isPaidPlanId, type PaidPlanId } from "../data/paymentPlans";
import { services } from "../data/services";

// Renders the pricing section with the original visual layout. Paid plan
// buttons open a checkout overlay (二级菜单) instead of scrolling to an anchor.
export function PricingCheckout() {
  const [selectedPlan, setSelectedPlan] = useState<PaidPlanId | null>(null);

  useEffect(() => {
    if (!selectedPlan) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [selectedPlan]);

  function handleSelect(id: string) {
    if (isPaidPlanId(id)) {
      setSelectedPlan(id);
    }
  }

  return (
    <>
      <div className="service-ladder" aria-label="Service progression">
        <span>Machine finds</span>
        <b>→</b>
        <span>Entry order</span>
        <b>→</b>
        <span>Human verifies</span>
        <b>→</b>
        <span>Expert researches</span>
        <b>→</b>
        <span>Expert implements</span>
      </div>
      <div className="service-decision-strip">
        <div>
          <span>Start with the question you need answered</span>
          <strong>Find gaps → establish a baseline → fix and retest</strong>
        </div>
        <p>Every paid plan produces an evidence trail. Upgrade only when the next layer is useful.</p>
      </div>
      <div className="pricing-groups">
        <div className="pricing-group">
          <div className="pricing-group__heading">
            <span>01</span>
            <div>
              <h3>Low-risk first step</h3>
            </div>
          </div>
          <div className="pricing-grid pricing-grid--two">
            {services.slice(0, 2).map((service) => (
              <ServicePlanCard
                service={service}
                key={service.id}
                onSelect={service.id !== "free" ? handleSelect : undefined}
              />
            ))}
          </div>
        </div>
        <div className="pricing-group">
          <div className="pricing-group__heading">
            <span>02</span>
            <div>
              <h3>Facts checked before you act</h3>
            </div>
          </div>
          <div className="pricing-grid pricing-grid--one">
            <ServicePlanCard
              service={services[2]}
              onSelect={handleSelect}
            />
          </div>
        </div>
        <div className="pricing-group">
          <div className="pricing-group__heading">
            <span>03</span>
            <div>
              <h3>Research or implementation</h3>
            </div>
          </div>
          <div className="pricing-grid pricing-grid--two">
            {services.slice(3).map((service) => (
              <ServicePlanCard
                service={service}
                key={service.id}
                onSelect={handleSelect}
              />
            ))}
          </div>
        </div>
      </div>
      <p className="pricing-note">
        Upgrade credit: move to a higher plan within 14 days and the
        amount already paid is deducted from the next plan.
      </p>

      {selectedPlan ? (
        <div
          className="checkout-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedPlan} plan checkout`}
        >
          <button
            type="button"
            className="checkout-overlay__backdrop"
            aria-label="Close checkout"
            onClick={() => setSelectedPlan(null)}
          />
          <div className="checkout-overlay__panel">
            <button
              type="button"
              className="checkout-overlay__close"
              aria-label="Close"
              onClick={() => setSelectedPlan(null)}
            >
              ×
            </button>
            <UsdtCheckout initialPlanId={selectedPlan} />
          </div>
        </div>
      ) : null}
    </>
  );
}
