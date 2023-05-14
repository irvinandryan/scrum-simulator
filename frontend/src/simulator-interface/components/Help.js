import React from "react";

export const Help = ({active, handleClickModal}) => {
    return (
        <div className="help">
            <div className={`modal ${active}`}>
                <div class="modal-background"></div>
                <div class="modal-card">
                    <header class="modal-card-head has-background-grey-lighter has-text-centered">
                        <p class="modal-card-title has-text-black"><strong>Help</strong></p>
                        <button onClick={handleClickModal} class="delete" aria-label="close"></button>
                    </header>
                    <section class="modal-card-body has-text-dark">
                        <h1 class="modal-card-title">Sprint Planning</h1>
                        <div className="is-size-6">
                            <p>1. Create a new sprint by clicking on the <strong>Create Sprint</strong> button.</p>
                            <p>2. Add a new task by clicking on the <strong>Add Task</strong> button.</p>
                            <p>3. Edit a task by clicking on the <strong>Edit</strong> button.</p>
                            <p>4. Delete a task by clicking on the <strong>Delete</strong> button.</p>
                            <p>5. Move a task to the next sprint by clicking on the <strong>Move</strong> button.</p>
                            <p>6. Move a task to the previous sprint by clicking on the <strong>Move</strong> button.</p>
                            <p>7. Move a task to the current sprint by clicking on the <strong>Move</strong> button.</p>
                        </div>
                        <br />
                        <h1 class="modal-card-title">Modal content</h1>
                        <div className="is-size-6">
                            <p>1. Create a new sprint by clicking on the <strong>Create Sprint</strong> button.</p>
                            <p>2. Add a new task by clicking on the <strong>Add Task</strong> button.</p>
                            <p>3. Edit a task by clicking on the <strong>Edit</strong> button.</p>
                            <p>4. Delete a task by clicking on the <strong>Delete</strong> button.</p>
                            <p>5. Move a task to the next sprint by clicking on the <strong>Move</strong> button.</p>
                            <p>6. Move a task to the previous sprint by clicking on the <strong>Move</strong> button.</p>
                            <p>7. Move a task to the current sprint by clicking on the <strong>Move</strong> button.</p>
                        </div>
                        <br />
                        <h1 class="modal-card-title">Modal content</h1>
                        <div className="is-size-6">
                            <p>1. Create a new sprint by clicking on the <strong>Create Sprint</strong> button.</p>
                            <p>2. Add a new task by clicking on the <strong>Add Task</strong> button.</p>
                            <p>3. Edit a task by clicking on the <strong>Edit</strong> button.</p>
                            <p>4. Delete a task by clicking on the <strong>Delete</strong> button.</p>
                            <p>5. Move a task to the next sprint by clicking on the <strong>Move</strong> button.</p>
                            <p>6. Move a task to the previous sprint by clicking on the <strong>Move</strong> button.</p>
                            <p>7. Move a task to the current sprint by clicking on the <strong>Move</strong> button.</p>
                        </div>
                    </section>
                    <footer class="modal-card-foot has-background-grey-lighter buttons is-centered">
                        <button onClick={handleClickModal} class="button is-fullwidth has-background-dark has-text-white"><strong>Close</strong></button>
                    </footer>
                </div>
            </div>
        </div>
    )
}