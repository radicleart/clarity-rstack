;; Project Lightning Swaps
;; -----------------------
;; Fraud proof swaps. This contract transfers STX tokens to user on receipt of a valid
;; preimage proving payment on Lightning via LSAT protocol. Validation of the preimage 
;; happens off-chain before the contract call.

;; Constants
;; ---------
(define-constant administrator 'ST1EYJJ3V4DNRVHRWANP8S3CXJ70SFBJF2F8DH2RM)
(define-constant not-allowed u100)
(define-constant not-found u100)

;; Storage
;; -------
;; preimage-map : map of payments against recipients
(define-map preimage-map ((preimage (buff 32))) ((recipient principal) (amount uint) (paid bool)))

;; Public Functions
;; ----------------

;; transfer stx:
;;      The preimage is not already contained in the map
;;      The amount is less than the senders balance
;;

(define-public (transfer-to-recipient! (recipient principal) (preimage (buff 32)) (amount uint))
  (begin
    (if (is-create-allowed)
      (begin
        (map-insert preimage-map {preimage: preimage} ((recipient recipient) (amount amount) (paid true)))
        (ok preimage)
      )
      (err not-allowed)
    )
    (if (is-transfer-allowed)
      (stx-transfer? amount tx-sender recipient)
      (err u400)
    )
  )
)

;; fetch transfer by its preimage
(define-public (get-tranfer (preimage (buff 32)))
  (match (map-get? preimage-map {preimage: preimage})
    myTransfer (ok myTransfer) (err not-found)
  )
)

(define-read-only (get-administrator)
  (ok administrator))


;; Only contract administrator can do these things
(define-private (is-transfer-allowed)
  (is-eq tx-sender administrator)
)

(define-private (is-create-allowed)
  (is-eq tx-sender administrator)
)
