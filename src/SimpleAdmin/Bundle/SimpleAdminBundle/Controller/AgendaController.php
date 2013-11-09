<?php

namespace SimpleAdmin\Bundle\SimpleAdminBundle\Controller;

use SimpleAdmin\Bundle\SimpleAdminBundle\Service\FPDF;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;


class AgendaController extends Controller
{
    /**
     * @param $request Request
     * @return array()
     *
     * @Route("/agenda/page")
     * @Template
     */
    public function pageAction(Request $request)
    {
        $year = date('Y');
        $monthsNames = array(1=>"enero",2=>"febrero",3=>"marzo",
            4=>"abril",5=>"mayo",6=>"junio",7=>"julio",
            8=>"agosto",9=>"septiembre",10=>"octubre",
            11=>"noviembre",12=>"diciembre"
        );
        $weekDays = array(
            0=> "domingo",1=>"lunes",2=>"martes",3=>"miércoles",
            4=>"jueves",5=>"viernes",6=>"sábado"
        );


        $days = array();

        foreach($monthsNames as $number=>$name){
            $lastDay = date('t',strtotime($year.'-'.$number.'-1'));
            for($day = 1; $day <= $lastDay; $day++){

                $days[] = array('name'=>$weekDays[date( "w", strtotime($year.'-'.$number.'-'.$day))],'number'=>$day,'month'=>$name);
            }
        }

        $pdf = $this->get('fpdf');
        $pdf->SetFontPath(__DIR__.'/../Resources/public/fonts/') ;
        $pdf->AddFont('custom_font','','are_you_freaking_serious.php');
        $pdf->SetFont('custom_font');
        $this->printCalendar($pdf);

        $bufferSize = 20;
        foreach($days as $day){
            $dayBuffer[] = $day;
            if(count($dayBuffer) == $bufferSize || $day == $days[count($days)-1]){
                if(count($dayBuffer) == $bufferSize){
                    $chunks = array_chunk($dayBuffer,$bufferSize/2);
                }else{
                    $chunks = array_chunk($dayBuffer,round(count($dayBuffer)/2));
                }
                $left = $chunks[1];
                $right = $chunks[0];
                for($i=1;$i<=($bufferSize/2);$i++){
                    if($i%2==0){
                        $this->calendarPage($pdf,isset($right[$i-1])?$right[$i-1]:null,isset($left[(($bufferSize/2)-($i))])?$left[(($bufferSize/2)-($i))]:null);
                    }else{
                        $this->calendarPage($pdf,isset($left[(($bufferSize/2)-($i))])?$left[(($bufferSize/2)-($i))]:null,isset($right[$i-1])?$right[$i-1]:null );
                    }
                }
                $dayBuffer=array();
            }
        }


        $this->printNotes($pdf);

        $pdf->Output(__DIR__.'/../Resources/public/fonts/calendar.pdf','F');
        return array();
    }

    /**
     * @param $pdf FPDF
     */
    private function printCalendar($pdf){

        $pdf->SetFontSize(22);
        $pdf->SetTextColor(64,64,64);

        $pdf->addPage('L',array(411,595));
        $pdf->SetMargins(0,0,0);

        $pdf->Image(__DIR__.'/../Resources/public/images/2014-second-semester.png',0,0,297);
        $pdf->SetXY(0,24);
        $pdf->Cell(297,26,strtoupper("Calendario 2014"),0,0,'C');

        $pdf->Image(__DIR__.'/../Resources/public/images/2015-first-semester.png',297,0,297);
        $pdf->SetXY(297,24);
        $pdf->Cell(297,26,strtoupper("Calendario 2015"),0,0,'C');

        $pdf->addPage('L',array(411,595));
        $pdf->SetMargins(0,0,0);

        $pdf->Image(__DIR__.'/../Resources/public/images/2015-second-semester.png',0,0,297);
        $pdf->SetXY(0,24);
        $pdf->Cell(297,26,strtoupper("Calendario 2015"),0,0,'C');

        $pdf->Image(__DIR__.'/../Resources/public/images/2014-first-semester.png',297,0,297);
        $pdf->SetXY(297,24);
        $pdf->Cell(297,26,strtoupper("Calendario 2014"),0,0,'C');

        $this->printPageBorder($pdf);
    }

    private function printNotes($pdf,$left=true,$right=true){
        if($left && $right){
            $pdf->addPage('L',array(411,595));
            $pdf->SetMargins(0,0,0);
            $pdf->SetTextColor(64,64,64);
        }
        $pdf->SetFontSize(22);
        if($left){
            $pdf->SetXY(0,34);
            $pdf->Cell(297,26,strtoupper("notas"),0,0,'C');
        }
        if($right){
            $pdf->SetXY(297,34);
            $pdf->Cell(297,26,strtoupper("notas"),0,0,'C');
        }
        if($left && $right){
            $this->printPageBorder($pdf);
        }
    }

    function printPageBorder($pdf){
        $pdf->SetLineWidth(3);
        $pdf->Rect(0,0,594,410);
    }

    /**
     * @param $pdf FPDF
     * @param $dayBuffer array
     * @param $idxLeft int
     * @param $idxRight int
     */
    private function calendarPage($pdf,$idxLeft = null,$idxRight = null){

        if($idxLeft!==null || $idxRight !==null){
            $pdf->addPage('L',array(411,595));
            $pdf->SetMargins(0,0,0);
            $pdf->SetLineWidth(1);
            $pdf->SetTextColor(64,64,64);

            #Draw left page
            if($idxLeft!==null){
                #Draw month name
                $pdf->SetFontSize(29);
                $pdf->SetXY(0,34);
                $pdf->Cell(297,26,strtoupper($idxLeft['month']),0,0,'C');
                #Draw month separator
                $pdf->SetXY(0,80);
                $pdf->Image(__DIR__.'/../Resources/public/images/agenda-birds2.png',null,null,297);
                #Draw day
                $pdf->SetXY(0,108);
                $pdf->SetFontSize(12);
                $pdf->Cell(297,26,ucfirst(iconv('UTF-8', 'windows-1252',$idxRight['name'].'  '.$idxLeft['number'].'    ')),0,0,'R');

            }else{
                $this->printNotes($pdf,true,false);
            }

            #Draw right page
            if($idxRight!==null){
                #Draw month name
                $pdf->SetFontSize(29);
                $pdf->SetXY(297,34);
                $pdf->Cell(297,26,strtoupper($idxRight['month']),0,0,'C');
                #Draw month separator
                $pdf->SetXY(297,81.5);
                $pdf->Image(__DIR__.'/../Resources/public/images/agenda-birds-3.png',null,null,297,0,'PNG');
                #Draw day
                $pdf->SetXY(297,108);
                $pdf->SetFontSize(12);
                $pdf->Cell(297,26,ucfirst(iconv('UTF-8', 'windows-1252',$idxRight['name'].'  '.$idxRight['number'].'    ')),0,0,'R');
            }else{
                $this->printNotes($pdf,false,true);
            }
            $this->printPageBorder($pdf);
        }
    }
}