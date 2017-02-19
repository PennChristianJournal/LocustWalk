
import React, {Component} from 'react'
import moment from 'moment'

export default class ArticleSidebar extends Component {
    constructor(props) {
        super(props);
        const article = props.article || {};
        this.state = {
            dateNow: article.date ? false : true,
            date: new Date()
        }    
    }

    componentWillReceiveProps(nextProps) {
        const article = nextProps.article || {};
        this.state = {
            dateNow: article.date ? false : true
        }
    }

    componentDidMount() {
        this.timerID = setInterval(() => this.tick(), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        this.setState({
            date: new Date()
        });
    }

    dateNowToggled(event) {
        this.setState({
            dateNow: event.target.checked
        })
    }

    render() {
        const article = this.props.article || {};
        return (
            <div className="admin-sidebar">
                {this.props.gdriveSync ? 
                <form className="form" action="sync" method="POST">
                    <div className="form-group">
                        <label>Pull from Google Drive</label>
                        <div className="row">
                            <div className="col-sm-6">
                                <input className="form-control" id="doc-search" placeholder="Document Title" />
                            </div>
                            <div className="col-sm-6">
                                <input className="form-control" id="doc-id-input" name="doc_id" placeholder="Document ID" readOnly />      
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <button className="btn btn-default" type="submit" onClick={function() {return confirm('Content on this page will be replaced. Are you sure?')}}>Sync</button>
                    </div>
                </form>
                : null}
                <form className="form" key={article._id} action={`/admin/articles/${article._id}/edit`} method="post" encType="multipart/form-data">
                    <div className="form-group">
                        <label htmlFor="cover-photo-input">Cover Photo</label>
                        { this.props.imagePreviews ? <img src={article.cover ? `/files/${article.cover}` : ''} /> : null }
                        <input id="cover-photo-input" name="cover" type="file" accept="image/*" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="thumbnail-input">Thumbnail</label>
                        { this.props.imagePreviews ? <img src={article.thumb ? `/files/${article.thumb}` : ''} /> : null }
                        <input id="thumbnail-input" name="thumb" type="file" accept="image/*" />
                    </div>
                    <div className="form-group">
                        <div className="checkbox">
                            <label htmlFor="is_featured-input" className="checkbox-inline">
                                <input id="is_featured-input" name="is_featured" type="checkbox" defaultChecked={article.is_featured || false} />
                                Featured
                            </label>
                            <label htmlFor="is_published-input" className="checkbox-inline">
                                <input id="is_published-input" name="is_published" type="checkbox" defaultChecked={article.is_published || false} />
                                Published
                            </label>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="title-input">Title</label>
                        <input id="title-type" name="title" type="text" className="form-control" placeholder="Article Title" defaultValue={article.title} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="author-input">Author</label>
                        <input id="author-input" name="author" type="text" className="form-control" placeholder="Author" defaultValue={article.author} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="slug-input">Slug</label>
                        <input id="slug-input" name="slug" type="text" className="form-control" placeholder="Slug" defaultValue={article.slug} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="response-to-input">Response To</label>
                        <div className="row">
                            <div className="col-sm-6">
                                <input id="response-to-input" type="text" className="form-control" placeholder="Response To..." defaultValue={article.parent} />
                            </div>
                            <div className="col-sm-6">
                                <input name="parent" type="text" readOnly className="form-control" placeholder="Article ID" value={article.parent || ''} />
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="date-input">Post Date</label>
                        <input id="date-input" name="date" type="text" className="form-control" disabled={this.state.dateNow} onChange={function(){}} value={moment(this.state.dateNow ? this.state.date : article.date).format('MMM DD, YYYY [at] H:mm:ss')} />
                        <div className="checkbox">
                            <label className="checkbox-inline">
                                <input type="checkbox" checked={this.state.dateNow} onChange={this.dateNowToggled.bind(this)} />
                                Now
                            </label>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="heading-input">Heading Override</label>
                        <input id="heading-input" name="heading_override" type="text" className="form-control" placeholder="Jun 2016 Special Feature" 
                            defaultValue={article.heading_override || moment(this.state.dateNow ? this.state.date : article.date).format('MMM YYYY [Feature Article]')} 
                        />
                    </div>
                    <button className="btn btn-primary" type="submit">Save</button>
                </form>
            </div>
        )
    }
}