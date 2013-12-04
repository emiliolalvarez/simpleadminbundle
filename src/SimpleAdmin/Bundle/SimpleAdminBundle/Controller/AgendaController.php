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

    private $printablePageWidth = 595;
    private $printablePageHeight = 411;
    private $pageWidth = 841.890;
    private $pageHeight = 595.276;
    private $printableSinglePageWidth=297;
    private $leftMargin = 0;
    private $topMargin = 0;

    /**
     * @param $request Request
     * @return array()
     *
     * @Route("/agenda/page")
     * @Template
     */
    public function pageAction(Request $request)
    {
        #297mm = 841.890 puntos
        #210mm = 595.276 puntos

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

        $this->topMargin = (($this->pageHeight - $this->printablePageHeight )/2 );
        $this->leftMargin = (($this->pageWidth - $this->printablePageWidth )/2 );

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

        $pdf->addPage('L',array($this->pageHeight,$this->pageWidth));
        $pdf->SetMargins(0,0);

        $pdf->Image(__DIR__.'/../Resources/public/images/2014-second-semester.png',$this->leftMargin + 0,$this->topMargin + 0,$this->printableSinglePageWidth);
        $pdf->SetXY($this->leftMargin + 0,$this->topMargin + 24);
        $pdf->Cell($this->printableSinglePageWidth,26,strtoupper("Calendario 2014"),0,0,'C');

        $pdf->Image(__DIR__.'/../Resources/public/images/2015-first-semester.png',$this->leftMargin + $this->printableSinglePageWidth,$this->topMargin + 0,$this->printableSinglePageWidth);
        $pdf->SetXY($this->leftMargin + $this->printableSinglePageWidth,$this->topMargin + 24);
        $pdf->Cell($this->printableSinglePageWidth,26,strtoupper("Calendario 2015"),0,0,'C');

        $this->printPageBorder($pdf);

        $pdf->addPage('L',array($this->pageHeight,$this->pageWidth));
        $pdf->SetMargins(0,0);

        $pdf->Image(__DIR__.'/../Resources/public/images/2015-second-semester.png',$this->leftMargin+0,$this->topMargin + 0,$this->printableSinglePageWidth);
        $pdf->SetXY($this->leftMargin + 0,$this->topMargin + 24);
        $pdf->Cell($this->printableSinglePageWidth,26,strtoupper("Calendario 2015"),0,0,'C');

        $pdf->Image(__DIR__.'/../Resources/public/images/2014-first-semester.png',$this->leftMargin + $this->printableSinglePageWidth,$this->topMargin + 0,$this->printableSinglePageWidth);
        $pdf->SetXY($this->leftMargin + $this->printableSinglePageWidth,$this->topMargin + 24);
        $pdf->Cell($this->printableSinglePageWidth,26,strtoupper("Calendario 2014"),0,0,'C');

        $this->printPageBorder($pdf);
    }

    private function printNotes($pdf,$left=true,$right=true){
        if($left && $right){
            $pdf->AddPage('L',array($this->pageHeight,$this->pageWidth));
            $pdf->SetMargins(0,0);
            $pdf->SetTextColor(64,64,64);
        }
        $pdf->SetFontSize(29);
        if($left){
            $pdf->SetXY($this->leftMargin + 0,$this->topMargin + 34);
            $pdf->Cell($this->printableSinglePageWidth,26,strtoupper("notas"),0,0,'C');
            #Draw month separator
            $pdf->SetXY($this->leftMargin + 0,$this->topMargin + 80);
            #$pdf->Image(__DIR__.'/../Resources/public/images/agenda-birds2.png',null,null,$this->printableSinglePageWidth);
            $pdf->Line($this->leftMargin + 0,$this->topMargin + 81.5,$this->leftMargin + $this->printableSinglePageWidth,$this->topMargin + 81.5);
        }
        if($right){
            $pdf->SetXY($this->leftMargin + $this->printableSinglePageWidth,$this->topMargin + 34);
            $pdf->Cell($this->printableSinglePageWidth,26,strtoupper("notas"),0,0,'C');
            #Draw month separator
            $pdf->SetXY($this->leftMargin + $this->printableSinglePageWidth,$this->topMargin + 81.5);
            #$pdf->Image(__DIR__.'/../Resources/public/images/agenda-birds-3.png',null,null,$this->printableSinglePageWidth,0,'PNG');
            $pdf->Line($this->leftMargin + $this->printableSinglePageWidth + 1,$this->topMargin + 81.5,$this->leftMargin + ( ($this->printableSinglePageWidth)*2 -1 ) ,$this->topMargin + 81.5);

        }
        if($left && $right){
            $this->printPageBorder($pdf);
        }
    }

    function printPageBorder($pdf,$borderWidth = 1){
        $pdf->SetLineWidth($borderWidth);
        $pdf->Rect($this->leftMargin,$this->topMargin,($this->printablePageWidth-(2*$borderWidth)),($this->printablePageHeight-(2*$borderWidth)));
    }

    /**
     * @param $pdf FPDF
     * @param $dayBuffer array
     * @param $idxLeft int
     * @param $idxRight int
     */
    private function calendarPage($pdf,$idxLeft = null,$idxRight = null){

        if($idxLeft!==null || $idxRight !==null){
            $pdf->AddPage('L',array($this->pageHeight,$this->pageWidth));
            $pdf->SetMargins(0,0);
            $pdf->SetLineWidth(1);
            $pdf->SetTextColor(64,64,64);

            #Draw left page
            if($idxLeft!==null){
                #Draw month name
                $pdf->SetFontSize(29);
                $pdf->SetXY($this->leftMargin + 0,$this->topMargin + 34);
                $pdf->Cell($this->printableSinglePageWidth,26,strtoupper($idxLeft['month']),0,0,'C');
                #Draw month separator
                $pdf->SetXY($this->leftMargin + 0,$this->topMargin + 80);
                #$pdf->Image(__DIR__.'/../Resources/public/images/agenda-birds2.png',null,null,$this->printableSinglePageWidth);
                $pdf->Line($this->leftMargin + 1,$this->topMargin + 81.5,$this->leftMargin + $this->printableSinglePageWidth,$this->topMargin + 81.5);
                #Draw day
                $pdf->SetXY($this->leftMargin + 0,$this->topMargin + 108);
                $pdf->SetFontSize(12);
                $pdf->Cell($this->printableSinglePageWidth,26,ucfirst(iconv('UTF-8', 'windows-1252',$idxLeft['name'].'  '.$idxLeft['number'].'    ')),0,0,'R');

            }else{
                $this->printNotes($pdf,true,false);
            }

            #Draw right page
            if($idxRight!==null){
                #Draw month name
                $pdf->SetFontSize(29);
                $pdf->SetXY($this->leftMargin + $this->printableSinglePageWidth,$this->topMargin + 34);
                $pdf->Cell($this->printableSinglePageWidth,26,strtoupper($idxRight['month']),0,0,'C');
                #Draw month separator
                $pdf->SetXY($this->leftMargin + $this->printableSinglePageWidth,$this->topMargin + 81.5);
                #$pdf->Image(__DIR__.'/../Resources/public/images/agenda-birds-3.png',null,null,$this->printableSinglePageWidth,0,'PNG');
                $pdf->Line($this->leftMargin + $this->printableSinglePageWidth + 1,$this->topMargin + 81.5,$this->leftMargin + (($this->printableSinglePageWidth)*2 - 1),$this->topMargin + 81.5);
                #Draw day
                $pdf->SetXY($this->leftMargin + $this->printableSinglePageWidth,$this->topMargin + 108);
                $pdf->SetFontSize(12);
                $pdf->Cell($this->printableSinglePageWidth,26,ucfirst(iconv('UTF-8', 'windows-1252',$idxRight['name'].'  '.$idxRight['number'].'    ')),0,0,'R');
            }else{
                $this->printNotes($pdf,false,true);
            }
            $this->printPageBorder($pdf);
        }
    }

    public function getTestNumber(){
        return 1;
    }
}