import * as React from 'react'; 
import Table from '@mui/material/Table'; 
import TableBody from '@mui/material/TableBody'; 
import TableCell from '@mui/material/TableCell'; 
import TableContainer from '@mui/material/TableContainer'; 
import TableHead from '@mui/material/TableHead'; 
import TableRow from '@mui/material/TableRow'; 
import TablePagination from '@mui/material/TablePagination'; 
import Paper from '@mui/material/Paper'; 
import open_external from './open_external.svg'; 
import styles from './Documents.module.css';
import doc1 from '../../projects/SudanDashboard/documents/20231122_access_analysis.png';
import doc0 from '../../projects/SudanDashboard/documents/20231031_situation_analysis.png';
const rows = [ 
    {
        title: 'Sudan: Cross-Border Humanitarian Access Analysis',
        type: 'Analysis',
        date: '22 November 2023',
        author: 'iMMAP Inc.',
        description: 'This report provides an overview of the conflict dynamics around Chad–Sudan and South Sudan–Sudan Border Cross Points (BCPs) along with mapping the access routes into Sudan for humanitarian agencies. It also outlines the trajectory of the mentioned border areas.',
        download: 'https://reliefweb.int/report/sudan/sudan-cross-border-humanitarian-access-analysis-22-november-2023',
        thumbnail: doc1
    },
    {
        title: 'Sudan Crisis: Situational Analysis',
        type: 'Analysis',
        date: '31 October 2023',
        author: 'iMMAP Inc./DFS',
        description: 'The document presents a comprehensive overview of the situation in Sudan, where an ongoing conflict has led to a substantial loss of life, primarily attributed to devastating bombings in Khartoum. The report covers developments in the time period of August-September 2023, but provides background information since the conflict outbreak.',
        download: 'https://immap.org/product/situational-analysis-of-sudans-crisis-october-2023/',
        thumbnail: doc0
    }
]; 
  
export default function BasicTable() { 
    const [pg, setpg] = React.useState(0); 
    const [rpg, setrpg] = React.useState(5); 
  
    function handleChangePage(event, newpage) { 
        setpg(newpage); 
    } 
  
    function handleChangeRowsPerPage(event) { 
        setrpg(parseInt(event.target.value, 10)); 
        setpg(0); 
    } 
  
    return ( 
        <div className={styles.container}>
            <Paper className={styles.documents} style={{backgroundColor: 'unset', position: 'relative'}}> 
                <div className={styles.divTitle}> 
                    Latest Documents 
                </div> 
                <TableContainer component={Paper}> 
                    <Table sx={{ minWidth: 650, maxWidth: '100%' }}  
                        aria-label="simple table"> 
                        <TableHead> 
                            <TableRow key="header"> 
                                <TableCell></TableCell> 
                                <TableCell align="left"></TableCell> 
                                <TableCell align="left">Date</TableCell> 
                                <TableCell align="left">Author</TableCell> 
                                <TableCell align="left">Type</TableCell> 
                                <TableCell className={styles.hideMobile} align="left">Description</TableCell> 
                                <TableCell style={{paddingRight: 11, paddingLeft: 3}} align="right"></TableCell> 
                            </TableRow> 
                        </TableHead> 
                        <TableBody> 
                            {rows.slice(pg * rpg, pg * rpg + rpg).map((row) => ( 
                                <TableRow 
                                    key={row.title+row.date} 
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }} 
                                > 
                                    <TableCell><a target="_blank" href={row.download}><img className={styles.thumnbail} src={row.thumbnail}/></a></TableCell> 
                                    <TableCell style={{whiteSpace: 'noWrap'}}><b>{row.title}</b></TableCell> 
                                    <TableCell style={{whiteSpace: 'noWrap'}} align="center">{row.date} </TableCell> 
                                    <TableCell style={{whiteSpace: 'noWrap'}} align="left">{row.author} </TableCell> 
                                    <TableCell style={{whiteSpace: 'noWrap'}} align="left">{row.type}</TableCell> 
                                    <TableCell className={styles.hideMobile} style={{color: '#666', fontSize: 9}} align="left">{row.description}</TableCell> 
                                    <TableCell style={{paddingTop: 5, paddingLeft: 3, paddingRight: 16}} align="right"><a target="_blank" href={row.download}><img className={styles.open} src={open_external} height={14}/></a></TableCell> 
                                </TableRow> 
                            ))} 
                        </TableBody> 
                    </Table> 
                </TableContainer> 
                {/* <TablePagination 
                    className={styles.pagination}
                    rowsPerPageOptions={[5]} 
                    component="div"
                    size="small"
                    count={rows.length} 
                    rowsPerPage={rpg} 
                    page={pg} 
                    onPageChange={handleChangePage} 
                    onRowsPerPageChange={handleChangeRowsPerPage} 
                />  */}
            </Paper>
        </div> 
    ); 
}