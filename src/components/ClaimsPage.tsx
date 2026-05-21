import React, { useMemo, useReducer } from 'react';
import { DSCoreShell, type DSCoreNavId } from './dscore/DSCoreShell';
import {
  claimsReducer,
  initClaimsState,
} from './dscore/claims/claimsState';
import { applyClaimFilters } from './dscore/claims/claimsAggregator';
import { ClaimsKpiStrip } from './dscore/claims/ClaimsKpiStrip';
import { ClaimsFilters } from './dscore/claims/ClaimsFilters';
import { ClaimsAgingChart } from './dscore/claims/ClaimsAgingChart';
import { ClaimsList } from './dscore/claims/ClaimsList';
import { ClaimDetailPanel } from './dscore/claims/ClaimDetailPanel';
import { FileAppealModal, PostPaymentModal, WriteOffModal } from './dscore/claims/ClaimActionModals';

interface ClaimsPageProps {
  onBackToHome?: () => void;
  onNavigate?: (id: DSCoreNavId) => void;
}

export default function ClaimsPage({ onBackToHome, onNavigate }: ClaimsPageProps) {
  const [state, dispatch] = useReducer(claimsReducer, undefined, () => initClaimsState());

  const allClaims = useMemo(
    () => state.order.map((id) => state.claims[id]).filter(Boolean),
    [state.claims, state.order],
  );
  const filtered = useMemo(
    () => applyClaimFilters(allClaims, state.filters),
    [allClaims, state.filters],
  );

  const selectedClaim = state.selectedClaimId ? state.claims[state.selectedClaimId] : null;

  const modalClaim =
    state.modal.type !== 'none' && state.claims[state.modal.claimId]
      ? state.claims[state.modal.claimId]
      : null;

  return (
    <DSCoreShell
      active="claims"
      unread={0}
      onNavigate={(id) => {
        if (id === 'home' && onBackToHome) onBackToHome();
        else onNavigate?.(id);
      }}
    >
      <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '32px 40px 80px' }}>
        <header style={{ marginBottom: '20px' }}>
          <h1
            style={{
              fontFamily: 'var(--ads-font-sans)',
              fontWeight: 500,
              fontSize: '28px',
              lineHeight: '36px',
              letterSpacing: '-0.01em',
              color: 'var(--ads-text-primary)',
              margin: 0,
            }}
          >
            Claims & Revenue Cycle
          </h1>
          <p
            style={{
              fontFamily: 'var(--ads-font-sans)',
              fontSize: '14px',
              lineHeight: '20px',
              color: 'var(--ads-text-muted)',
              margin: '6px 0 0',
            }}
          >
            Submit claims, track adjudication, post payments, and work denials. Click any claim to drill in.
          </p>
        </header>

        <ClaimsKpiStrip
          claims={allClaims}
          onAR90Click={() => dispatch({ type: 'SET_FILTERS', patch: { agingBucket: '90+', status: 'all' } })}
        />

        <ClaimsFilters
          filters={state.filters}
          viewMode={state.viewMode}
          onChange={(patch) => dispatch({ type: 'SET_FILTERS', patch })}
          onChangeViewMode={(mode) => dispatch({ type: 'SET_VIEW_MODE', mode })}
        />

        {state.viewMode === 'aging' ? (
          <ClaimsAgingChart
            claims={allClaims}
            onBucketClick={(b) => {
              dispatch({ type: 'SET_FILTERS', patch: { agingBucket: b.bucket, status: 'all' } });
              dispatch({ type: 'SET_VIEW_MODE', mode: 'list' });
            }}
          />
        ) : (
          <ClaimsList claims={filtered} onSelect={(id) => dispatch({ type: 'SELECT_CLAIM', id })} />
        )}
      </div>

      <ClaimDetailPanel
        claim={selectedClaim}
        onClose={() => dispatch({ type: 'SELECT_CLAIM', id: null })}
        dispatch={dispatch}
      />

      {modalClaim && state.modal.type === 'post-payment' && (
        <PostPaymentModal
          claim={modalClaim}
          onClose={() => dispatch({ type: 'OPEN_MODAL', modal: { type: 'none' } })}
          dispatch={dispatch}
        />
      )}
      {modalClaim && state.modal.type === 'file-appeal' && (
        <FileAppealModal
          claim={modalClaim}
          onClose={() => dispatch({ type: 'OPEN_MODAL', modal: { type: 'none' } })}
          dispatch={dispatch}
        />
      )}
      {modalClaim && state.modal.type === 'write-off' && (
        <WriteOffModal
          claim={modalClaim}
          onClose={() => dispatch({ type: 'OPEN_MODAL', modal: { type: 'none' } })}
          dispatch={dispatch}
        />
      )}
    </DSCoreShell>
  );
}
