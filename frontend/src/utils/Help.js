import React from "react";

export const Help = ({active, handleClickModal}) => {
    return (
        <div className="help">
            <div className={`modal ${active}`}>
                <div class="modal-background"></div>
                <div class="modal-card">
                    <header class="modal-card-head">
                        <p class="modal-card-title">HELP PLANNING</p>
                        <button onClick={handleClickModal} class="delete" aria-label="close"></button>
                    </header>
                    <section class="modal-card-body">
                        <p>Modal content</p>
                    </section>
                    <footer class="modal-card-foot">
                        {/* <button class="button is-success">Save changes</button> */}
                        <button onClick={handleClickModal} class="button">Close</button>
                    </footer>
                </div>
            </div>
        </div>
    )
}